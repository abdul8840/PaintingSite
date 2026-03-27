import Order from '../models/Order.js';
import Artwork from '../models/Artwork.js';
import Coupon from '../models/Coupon.js';
import User from '../models/User.js';
import CustomOrder from '../models/CustomOrder.js';
import stripe from '../config/stripe.js';
import { sendOrderConfirmation, sendStatusUpdate } from '../utils/emailService.js';

// @desc    Create order / checkout session
// @route   POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, couponCode, paymentMethod = 'stripe' } = req.body;

    console.log('Creating order with data:', { items, shippingAddress, couponCode, paymentMethod });

    // Validation
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    if (!shippingAddress) {
      return res.status(400).json({ success: false, message: 'Shipping address is required' });
    }

    // Build order items and calculate subtotal
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const artwork = await Artwork.findById(item.artwork);
      if (!artwork) {
        return res.status(404).json({ 
          success: false, 
          message: `Artwork not found: ${item.artwork}` 
        });
      }
      if (artwork.stock < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `${artwork.title} is out of stock` 
        });
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

    // Apply coupon if provided
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
        return res.status(400).json({ 
          success: false, 
          message: 'Coupon not applicable to artwork orders' 
        });
      }

      discount = coupon.calculateDiscount(subtotal);
      couponData = { code: coupon.code, discount };
    }

    // Calculate totals - ensure all values are valid numbers
    const shippingCost = subtotal > 200 ? 0 : 15;
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = Math.round(taxableAmount * 0.08 * 100) / 100;
    const totalAmount = Math.round((subtotal - discount + shippingCost + tax) * 100) / 100;

    console.log('Order totals:', { subtotal, discount, shippingCost, tax, totalAmount });

    // Validate totals
    if (totalAmount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid order total amount' 
      });
    }

    // Create order
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
    console.log('Order created:', order._id);

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

    // Handle Stripe payment
    if (paymentMethod === 'stripe') {
      try {
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
          orderNumber: order.orderNumber,
          sessionId: session.id,
          url: session.url,
        });
      } catch (stripeError) {
        console.error('Stripe session error:', stripeError.message);
        // Delete the order if stripe fails
        await Order.findByIdAndDelete(order._id);
        return res.status(500).json({
          success: false,
          message: 'Payment initialization failed. Please try again.',
        });
      }
    }

    // COD payment
    order.orderStatus = 'confirmed';
    order.statusHistory.push({ 
      status: 'confirmed', 
      note: 'Cash on delivery order confirmed' 
    });
    await order.save();

    // Decrease stock
    for (const item of orderItems) {
      await Artwork.findByIdAndUpdate(item.artwork, {
        $inc: { stock: -item.quantity, sold: item.quantity },
      });
    }

    // Send confirmation email
    try {
      await sendOrderConfirmation(order, req.user.email);
    } catch (emailError) {
      console.error('Email error:', emailError);
      // Continue even if email fails
    }

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// @desc    Stripe webhook handler
// @route   POST /api/orders/webhook (mounted directly in server.js)
export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, 
      sig, 
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const orderId = session.metadata.orderId;
        const orderType = session.metadata.type;

        if (orderType === 'artwork-order') {
          const order = await Order.findById(orderId);
          if (order && order.paymentStatus !== 'paid') {
            order.paymentStatus = 'paid';
            order.orderStatus = 'confirmed';
            order.stripePaymentIntentId = session.payment_intent;
            order.statusHistory.push({ 
              status: 'confirmed', 
              note: 'Payment received via Stripe' 
            });
            await order.save();

            // Decrease stock
            for (const item of order.items) {
              await Artwork.findByIdAndUpdate(item.artwork, {
                $inc: { stock: -item.quantity, sold: item.quantity },
              });
            }

            // Send confirmation email
            const user = await User.findById(order.user);
            if (user) {
              await sendOrderConfirmation(order, user.email);
            }
          }
        } else if (orderType === 'custom-order') {
          const customOrder = await CustomOrder.findById(orderId);
          if (customOrder && customOrder.paymentStatus !== 'paid') {
            customOrder.paymentStatus = 'paid';
            customOrder.status = 'accepted';
            customOrder.stripePaymentIntentId = session.payment_intent;
            customOrder.statusHistory.push({ 
              status: 'accepted', 
              note: 'Payment received via Stripe' 
            });
            await customOrder.save();
          }
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const order = await Order.findOne({ 
          stripePaymentIntentId: paymentIntent.id 
        });
        if (order) {
          order.paymentStatus = 'failed';
          order.statusHistory.push({ 
            status: 'failed', 
            note: 'Payment failed' 
          });
          await order.save();
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error('Webhook processing error:', err.message);
    return res.status(500).json({ error: 'Webhook handler failed' });
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
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .lean();

    res.json({
      success: true,
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get orders error:', error);
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

    if (
      order.user._id.toString() !== req.user._id.toString() && 
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order by order number
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
    console.error('Track order error:', error);
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

    if (
      order.user.toString() !== req.user._id.toString() && 
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (['shipped', 'delivered', 'cancelled'].includes(order.orderStatus)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot cancel this order' 
      });
    }

    order.orderStatus = 'cancelled';
    order.cancelledAt = new Date();
    order.cancellationReason = req.body.reason || 'Cancelled by user';
    order.statusHistory.push({ 
      status: 'cancelled', 
      note: order.cancellationReason 
    });

    // Restore stock
    for (const item of order.items) {
      await Artwork.findByIdAndUpdate(item.artwork, {
        $inc: { stock: item.quantity, sold: -item.quantity },
      });
    }

    // Process refund if paid via Stripe
    if (order.paymentStatus === 'paid' && order.stripePaymentIntentId) {
      try {
        await stripe.refunds.create({ 
          payment_intent: order.stripePaymentIntentId 
        });
        order.paymentStatus = 'refunded';
      } catch (refundErr) {
        console.error('Refund error:', refundErr.message);
        // Continue with cancellation even if refund fails
      }
    }

    // Revert coupon usage
    if (order.coupon) {
      await Coupon.findOneAndUpdate(
        { code: order.coupon.code },
        {
          $inc: { usedCount: -1 },
          $pull: { usedBy: { user: req.user._id } },
        }
      );
    }

    await order.save();
    res.json({ success: true, order });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify payment session
// @route   GET /api/orders/verify-session/:sessionId
export const verifySession = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);

    // Check both order types
    let order = await Order.findOne({ stripeSessionId: session.id });
    let orderType = 'artwork';

    if (!order) {
      order = await CustomOrder.findOne({ stripeSessionId: session.id });
      orderType = 'custom';
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({
      success: true,
      orderType,
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus || order.status,
      },
    });
  } catch (error) {
    console.error('Verify session error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};