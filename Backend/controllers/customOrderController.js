import CustomOrder from '../models/CustomOrder.js';
import Coupon from '../models/Coupon.js';
import stripe from '../config/stripe.js';
import { calculateCustomOrderPrice } from '../utils/priceCalculator.js';
import { sendCustomOrderConfirmation } from '../utils/emailService.js';

// @desc    Calculate custom order price
// @route   POST /api/custom-orders/calculate-price
export const calculatePrice = async (req, res) => {
  try {
    const pricing = calculateCustomOrderPrice(req.body);
    res.json({ success: true, pricing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create custom order
// @route   POST /api/custom-orders
export const createCustomOrder = async (req, res) => {
  try {
    const {
      referenceImage, additionalImages, canvasSize, customSize,
      colorStyle, sketchStyle, framingOption, backgroundPreference,
      customBackgroundColor, numberOfSubjects, additionalNotes,
      isRushOrder, shippingAddress, couponCode, aiSuggestedStyles,
    } = req.body;

    if (!referenceImage || !referenceImage.url) {
      return res.status(400).json({ success: false, message: 'Reference image is required' });
    }

    // Calculate pricing
    const pricing = calculateCustomOrderPrice({
      canvasSize,
      customSize,
      sketchStyle,
      framingOption,
      numberOfSubjects,
      isRushOrder,
    });

    let discount = 0;
    let couponData = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (coupon) {
        const validation = coupon.isValid(pricing.subtotal, req.user._id);
        if (validation.valid && (coupon.applicableTo === 'all' || coupon.applicableTo === 'custom-order')) {
          discount = coupon.calculateDiscount(pricing.subtotal);
          couponData = { code: coupon.code, discount };

          await Coupon.findOneAndUpdate(
            { code: couponCode.toUpperCase() },
            {
              $inc: { usedCount: 1 },
              $push: { usedBy: { user: req.user._id, orderAmount: pricing.totalAmount - discount } },
            }
          );
        }
      }
    }

    const totalAmount = Math.round((pricing.subtotal - discount + pricing.shippingCost + pricing.tax) * 100) / 100;

    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + pricing.estimatedCompletionDays + 5);

    const customOrder = new CustomOrder({
      user: req.user._id,
      referenceImage,
      additionalImages: additionalImages || [],
      canvasSize,
      customSize: canvasSize === 'custom' ? customSize : undefined,
      colorStyle,
      sketchStyle,
      framingOption,
      backgroundPreference,
      customBackgroundColor,
      numberOfSubjects,
      additionalNotes,
      isRushOrder,
      basePrice: pricing.basePrice,
      sizeMultiplier: pricing.sizeMultiplier,
      styleMultiplier: pricing.styleMultiplier,
      framingCost: pricing.framingCost,
      subjectsCost: pricing.subjectsCost,
      rushOrderCost: pricing.rushOrderCost,
      subtotal: pricing.subtotal,
      discount,
      coupon: couponData,
      tax: pricing.tax,
      shippingCost: pricing.shippingCost,
      totalAmount,
      shippingAddress,
      estimatedCompletionDays: pricing.estimatedCompletionDays,
      estimatedDelivery,
      aiSuggestedStyles: aiSuggestedStyles || [],
      statusHistory: [{ status: 'pending', note: 'Custom order created' }],
    });

    await customOrder.save();

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: req.user.email,
      client_reference_id: customOrder._id.toString(),
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Custom ${sketchStyle} - ${canvasSize}`,
            description: `Custom painting order - ${colorStyle} ${sketchStyle}`,
          },
          unit_amount: Math.round(totalAmount * 100),
        },
        quantity: 1,
      }],
      metadata: {
        orderId: customOrder._id.toString(),
        type: 'custom-order',
      },
      success_url: `${process.env.CLIENT_URL}/order-success?session_id={CHECKOUT_SESSION_ID}&type=custom`,
      cancel_url: `${process.env.CLIENT_URL}/custom-painting`,
    });

    customOrder.stripeSessionId = session.id;
    await customOrder.save();

    res.status(201).json({
      success: true,
      order: customOrder,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get my custom orders
// @route   GET /api/custom-orders/my-orders
export const getMyCustomOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filter = { user: req.user._id };
    if (status) filter.status = status;

    const total = await CustomOrder.countDocuments(filter);
    const orders = await CustomOrder.find(filter)
      .populate('assignedArtist', 'firstName lastName')
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

// @desc    Get custom order by ID
// @route   GET /api/custom-orders/:id
export const getCustomOrderById = async (req, res) => {
  try {
    const order = await CustomOrder.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('assignedArtist', 'firstName lastName avatar');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Custom order not found' });
    }

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Request revision
// @route   PUT /api/custom-orders/:id/revision
export const requestRevision = async (req, res) => {
  try {
    const order = await CustomOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (order.status !== 'review') {
      return res.status(400).json({ success: false, message: 'Order is not in review stage' });
    }

    if (order.revisionCount >= order.maxRevisions) {
      return res.status(400).json({ success: false, message: 'Maximum revisions reached' });
    }

    order.status = 'revision-requested';
    order.revisionCount += 1;
    order.statusHistory.push({
      status: 'revision-requested',
      note: req.body.notes || 'Revision requested by customer',
    });

    await order.save();
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve custom order (customer approves final)
// @route   PUT /api/custom-orders/:id/approve
export const approveCustomOrder = async (req, res) => {
  try {
    const order = await CustomOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    order.status = 'completed';
    order.completedAt = new Date();
    order.statusHistory.push({ status: 'completed', note: 'Approved by customer' });

    await order.save();
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get pricing options for custom orders
// @route   GET /api/custom-orders/options
export const getCustomOrderOptions = async (req, res) => {
  try {
    const { SIZE_OPTIONS, STYLE_OPTIONS, FRAME_OPTIONS } = await import('../utils/priceCalculator.js');
    res.json({
      success: true,
      options: {
        canvasSizes: SIZE_OPTIONS,
        sketchStyles: STYLE_OPTIONS,
        framingOptions: FRAME_OPTIONS,
        colorStyles: ['full-color', 'black-and-white', 'sepia', 'monochrome', 'vintage', 'vibrant', 'pastel', 'muted'],
        backgroundPreferences: ['keep-original', 'plain-white', 'plain-black', 'blurred', 'custom-color', 'scenic', 'abstract-pattern', 'none'],
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};