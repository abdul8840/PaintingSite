import Order from '../models/Order.js';
import Artwork from '../models/Artwork.js';
import Coupon from '../models/Coupon.js';
import stripe from '../config/stripe.js';
import { sendOrderConfirmation, sendStatusUpdate } from '../utils/emailService.js';

// @desc    Create order / checkout session
// @route   POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, couponCode, paymentMethod = 'stripe' } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    if (!shippingAddress) {
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

    const shippingCost = subtotal > 200 ? 0 : 15;
    const tax = Math.round((subtotal - discount) * 0.08 * 100) / 100;
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

    if (paymentMethod === 'stripe') {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        customer_email: req.user.email,
        client_reference_id: order._id.toString(),
        line_items: orderItems.map(item => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.title,
              images: item.image ? [item.image] : [],
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        })),
        metadata: {
          orderId: order._id.toString(),
          type: 'artwork-order',
        },
        success_url: `${process.env.CLIENT_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/cart`,
      });

      order.stripeSessionId = session.id;
      await order.save();

      return res.json({
        success: true,
        order: order._id,
        sessionId: session.id,
        url: session.url,
      });
    }

    // COD
    order.orderStatus = 'confirmed';
    order.statusHistory.push({ status: 'confirmed', note: 'Cash on delivery order confirmed' });
    await order.save();

    // Update stock
    for (const item of orderItems) {
      await Artwork.findByIdAndUpdate(item.artwork, {
        $inc: { stock: -item.quantity, sold: item.quantity },
      });
    }

    await sendOrderConfirmation(order, req.user.email);

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Stripe webhook handler
// @route   POST /api/orders/webhook
export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const orderId = session.metadata.orderId;
      const orderType = session.metadata.type;

      if (orderType === 'artwork-order') {
        const order = await Order.findById(orderId);
        if (order) {
          order.paymentStatus = 'paid';
          order.orderStatus = 'confirmed';
          order.stripePaymentIntentId = session.payment_intent;
          order.statusHistory.push({ status: 'confirmed', note: 'Payment received' });
          await order.save();

          // Update stock
          for (const item of order.items) {
            await Artwork.findByIdAndUpdate(item.artwork, {
              $inc: { stock: -item.quantity, sold: item.quantity },
            });
          }

          const user = await (await import('../models/User.js')).default.findById(order.user);
          if (user) await sendOrderConfirmation(order, user.email);
        }
      } else if (orderType === 'custom-order') {
        const CustomOrder = (await import('../models/CustomOrder.js')).default;
        const customOrder = await CustomOrder.findById(orderId);
        if (customOrder) {
          customOrder.paymentStatus = 'paid';
          customOrder.status = 'accepted';
          customOrder.stripePaymentIntentId = session.payment_intent;
          customOrder.statusHistory.push({ status: 'accepted', note: 'Payment received' });
          await customOrder.save();
        }
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      // Find and update order
      const order = await Order.findOne({ stripePaymentIntentId: paymentIntent.id });
      if (order) {
        order.paymentStatus = 'failed';
        await order.save();
      }
      break;
    }
  }

  res.json({ received: true });
};

// @desc    Get user orders
// @route   GET /api/orders/my-orders
export const getMyOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filter = { user: req.user._id };
    if (status) filter.orderStatus = status;

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    res.json({
      success: true,
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
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

    // Check ownership
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order by order number
// @route   GET /api/orders/track/:orderNumber
export const trackOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber })
      .select('orderNumber orderStatus paymentStatus statusHistory trackingNumber trackingUrl estimatedDelivery deliveredAt items.title createdAt');

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
    order.statusHistory.push({ status: 'cancelled', note: order.cancellationReason });

    // Restore stock
    for (const item of order.items) {
      await Artwork.findByIdAndUpdate(item.artwork, {
        $inc: { stock: item.quantity, sold: -item.quantity },
      });
    }

    // Refund if paid
    if (order.paymentStatus === 'paid' && order.stripePaymentIntentId) {
      try {
        await stripe.refunds.create({ payment_intent: order.stripePaymentIntentId });
        order.paymentStatus = 'refunded';
      } catch (refundErr) {
        console.error('Refund error:', refundErr.message);
      }
    }

    await order.save();
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify payment session
// @route   GET /api/orders/verify-session/:sessionId
export const verifySession = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    const order = await Order.findOne({ stripeSessionId: session.id });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({
      success: true,
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};