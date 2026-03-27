import crypto from 'crypto';
import Order from '../models/Order.js';
import Artwork from '../models/Artwork.js';
import Coupon from '../models/Coupon.js';
import User from '../models/User.js';
import CustomOrder from '../models/CustomOrder.js';
import razorpay from '../config/razorpay.js';
import { sendOrderConfirmation, sendStatusUpdate } from '../utils/emailService.js';

// @desc    Create order + Razorpay order
// @route   POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, couponCode, paymentMethod = 'razorpay' } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    if (!shippingAddress || !shippingAddress.street) {
      return res.status(400).json({ success: false, message: 'Shipping address is required' });
    }

    // Validate items and calculate subtotal
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const artwork = await Artwork.findById(item.artwork);
      if (!artwork) {
        return res.status(404).json({ success: false, message: `Artwork not found: ${item.artwork}` });
      }
      if (artwork.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `${artwork.title} is out of stock` });
      }

      orderItems.push({
        artwork: artwork._id,
        title: artwork.title,
        image: artwork.images[0]?.url || '',
        price: artwork.price,
        quantity: item.quantity,
      });

      subtotal += artwork.price * item.quantity;
    }

    // Apply coupon
    let discount = 0;
    let couponData = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (!coupon) {
        return res.status(400).json({ success: false, message: 'Invalid coupon code' });
      }

      const validation = coupon.isValid(subtotal, req.user._id);
      if (!validation.valid) {
        return res.status(400).json({ success: false, message: validation.message });
      }

      if (coupon.applicableTo !== 'all' && coupon.applicableTo !== 'artwork') {
        return res.status(400).json({ success: false, message: 'Coupon not applicable to artwork orders' });
      }

      discount = coupon.calculateDiscount(subtotal);
      couponData = { code: coupon.code, discount };
    }

    const shippingCost = subtotal > 2000 ? 0 : 150;
    const tax = Math.round((subtotal - discount) * 0.18 * 100) / 100;
    const totalAmount = Math.round((subtotal - discount + shippingCost + tax) * 100) / 100;

    const order = new Order({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      subtotal,
      shippingCost,
      tax,
      discount,
      coupon: couponData,
      totalAmount,
      paymentMethod,
    });

    await order.save();

    // Update coupon usage
    if (couponCode) {
      await Coupon.findOneAndUpdate(
        { code: couponCode.toUpperCase() },
        {
          $inc: { usedCount: 1 },
          $push: { usedBy: { user: req.user._id, orderAmount: totalAmount } },
        }
      );
    }

    if (paymentMethod === 'razorpay') {
      try {
        // Create Razorpay order (amount in paise)
        const razorpayOrder = await razorpay.orders.create({
          amount: Math.round(totalAmount * 100),
          currency: 'INR',
          receipt: order.orderNumber,
          notes: {
            orderId: order._id.toString(),
            type: 'artwork-order',
            customerEmail: req.user.email,
          },
        });

        order.razorpayOrderId = razorpayOrder.id;
        await order.save();

        return res.json({
          success: true,
          order: {
            _id: order._id,
            orderNumber: order.orderNumber,
            totalAmount: order.totalAmount,
          },
          razorpayOrder: {
            id: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
          },
          keyId: process.env.RAZORPAY_KEY_ID,
        });
      } catch (razorpayError) {
        console.error('Razorpay order error:', razorpayError.message);
        // Delete the order if Razorpay order creation fails
        await Order.findByIdAndDelete(order._id);
        return res.status(500).json({
          success: false,
          message: 'Payment initialization failed. Please try again.',
          error: process.env.NODE_ENV === 'development' ? razorpayError.message : undefined,
        });
      }
    }

    // COD
    order.orderStatus = 'confirmed';
    order.paymentStatus = 'pending';
    order.statusHistory.push({ status: 'confirmed', note: 'Cash on delivery order confirmed', date: new Date() });
    await order.save();

    for (const item of orderItems) {
      await Artwork.findByIdAndUpdate(item.artwork, {
        $inc: { stock: -item.quantity, sold: item.quantity },
      });
    }

    await sendOrderConfirmation(order, req.user.email);

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/orders/verify-payment
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment verification data' });
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      if (orderId) {
        await Order.findByIdAndUpdate(orderId, {
          paymentStatus: 'failed',
          $push: { statusHistory: { status: 'failed', note: 'Payment verification failed', date: new Date() } },
        });
      }
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    // Find order by either razorpay order id or orderId
    let order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    
    if (!order && orderId) {
      order = await Order.findById(orderId);
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Prevent double processing
    if (order.paymentStatus === 'paid') {
      return res.json({ success: true, order, message: 'Payment already verified' });
    }

    // Update order
    order.paymentStatus = 'paid';
    order.orderStatus = 'confirmed';
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    order.statusHistory.push({
      status: 'confirmed',
      note: 'Payment verified via Razorpay',
      date: new Date(),
    });

    await order.save();

    // Decrease stock (if not already decreased for COD)
    if (order.paymentMethod !== 'cod') {
      for (const item of order.items) {
        await Artwork.findByIdAndUpdate(item.artwork, {
          $inc: { stock: -item.quantity, sold: item.quantity },
        });
      }
    }

    // Send confirmation email
    const user = await User.findById(order.user);
    if (user) {
      await sendOrderConfirmation(order, user.email);
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify custom order payment
// @route   POST /api/orders/verify-custom-payment
export const verifyCustomPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment data' });
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    const customOrder = await CustomOrder.findById(orderId);
    if (!customOrder) {
      return res.status(404).json({ success: false, message: 'Custom order not found' });
    }

    if (customOrder.paymentStatus === 'paid') {
      return res.json({ success: true, order: customOrder });
    }

    customOrder.paymentStatus = 'paid';
    customOrder.status = 'accepted';
    customOrder.razorpayPaymentId = razorpay_payment_id;
    customOrder.razorpaySignature = razorpay_signature;
    customOrder.statusHistory.push({
      status: 'accepted',
      note: 'Payment verified via Razorpay',
      date: new Date(),
    });

    await customOrder.save();

    const user = await User.findById(customOrder.user);
    if (user) {
      const { sendCustomOrderConfirmation } = await import('../utils/emailService.js');
      await sendCustomOrderConfirmation(customOrder, user.email);
    }

    res.json({ success: true, order: customOrder });
  } catch (error) {
    console.error('Verify custom payment error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/my-orders
export const getMyOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { status } = req.query;

    const filter = { user: req.user._id };
    if (status) filter.orderStatus = status;

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('items.artwork', 'title slug images');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Track order by number
// @route   GET /api/orders/track/:orderNumber
export const trackOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber })
      .select('orderNumber orderStatus paymentStatus statusHistory trackingNumber trackingUrl estimatedDelivery deliveredAt items.title createdAt totalAmount');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (['shipped', 'delivered', 'cancelled'].includes(order.orderStatus)) {
      return res.status(400).json({ success: false, message: 'Cannot cancel this order' });
    }

    order.orderStatus = 'cancelled';
    order.cancelledAt = new Date();
    order.cancellationReason = req.body.reason || 'Cancelled by user';
    order.statusHistory.push({ status: 'cancelled', note: order.cancellationReason, date: new Date() });

    // Restore stock
    for (const item of order.items) {
      await Artwork.findByIdAndUpdate(item.artwork, {
        $inc: { stock: item.quantity, sold: -item.quantity },
      });
    }

    // Razorpay refund
    if (order.paymentStatus === 'paid' && order.razorpayPaymentId) {
      try {
        await razorpay.payments.refund(order.razorpayPaymentId, {
          amount: Math.round(order.totalAmount * 100),
          notes: { reason: order.cancellationReason, orderNumber: order.orderNumber },
        });
        order.paymentStatus = 'refunded';
      } catch (refundErr) {
        console.error('Razorpay refund error:', refundErr.message);
      }
    }

    await order.save();
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};