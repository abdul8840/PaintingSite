import CustomOrder from '../models/CustomOrder.js';
import Coupon from '../models/Coupon.js';
// import stripe from '../config/stripe.js';
import { calculateCustomOrderPrice } from '../utils/priceCalculator.js';
// import { sendCustomOrderConfirmation } from '../utils/emailService.js';
import razorpay from '../config/razorpay.js';

// @desc    Calculate custom order price
// @route   POST /api/custom-orders/calculate-price
export const calculatePrice = async (req, res) => {
  try {
    const { canvasSize, customSize, sketchStyle, framingOption, numberOfSubjects, isRushOrder } = req.body;

    if (!canvasSize || !sketchStyle) {
      return res.status(400).json({ success: false, message: 'Canvas size and sketch style are required' });
    }

    const pricing = calculateCustomOrderPrice({
      canvasSize,
      customSize,
      sketchStyle,
      framingOption: framingOption || 'no-frame',
      numberOfSubjects: numberOfSubjects || 1,
      isRushOrder: isRushOrder || false,
    });

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

    if (!canvasSize || !sketchStyle || !colorStyle) {
      return res.status(400).json({ success: false, message: 'Canvas size, sketch style, and color style are required' });
    }

    if (!shippingAddress || !shippingAddress.street) {
      return res.status(400).json({ success: false, message: 'Shipping address is required' });
    }

    // Calculate pricing
    const pricing = calculateCustomOrderPrice({
      canvasSize,
      customSize,
      sketchStyle,
      framingOption: framingOption || 'no-frame',
      numberOfSubjects: numberOfSubjects || 1,
      isRushOrder: isRushOrder || false,
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

    const totalWithDiscount = Math.round((pricing.subtotal - discount + pricing.shippingCost + pricing.tax) * 100) / 100;

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
      framingOption: framingOption || 'no-frame',
      backgroundPreference: backgroundPreference || 'keep-original',
      customBackgroundColor,
      numberOfSubjects: numberOfSubjects || 1,
      additionalNotes: additionalNotes || '',
      isRushOrder: isRushOrder || false,
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
      totalAmount: totalWithDiscount,
      shippingAddress,
      estimatedCompletionDays: pricing.estimatedCompletionDays,
      estimatedDelivery,
      aiSuggestedStyles: aiSuggestedStyles || [],
      statusHistory: [{ status: 'pending', note: 'Custom order created', date: new Date() }],
    });

    await customOrder.save();

    // Create Stripe session
    // Inside createCustomOrder, replace the Stripe session creation with:

    // Create Razorpay order
    try {
      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(totalWithDiscount * 100), // paise
        currency: 'INR',
        receipt: customOrder.orderNumber,
        notes: {
          orderId: customOrder._id.toString(),
          type: 'custom-order',
          customerEmail: req.user.email,
        },
      });

      customOrder.razorpayOrderId = razorpayOrder.id;
      await customOrder.save();

      res.status(201).json({
        success: true,
        order: customOrder,
        razorpayOrder: {
          id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
        },
        keyId: process.env.RAZORPAY_KEY_ID,
      });
    } catch (razorpayError) {
      console.error('Razorpay error:', razorpayError.message);
      res.status(201).json({
        success: true,
        order: customOrder,
        message: 'Order created but payment initialization failed.',
      });
    }
  } catch (error) {
    console.error('Create custom order error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get my custom orders
// @route   GET /api/custom-orders/my-orders
export const getMyCustomOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { status } = req.query;

    const filter = { user: req.user._id };
    if (status) filter.status = status;

    const total = await CustomOrder.countDocuments(filter);
    const orders = await CustomOrder.find(filter)
      .populate('assignedArtist', 'firstName lastName')
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

// @desc    Get custom order by ID
// @route   GET /api/custom-orders/:id
export const getCustomOrderById = async (req, res) => {
  try {
    const order = await CustomOrder.findById(req.params.id)
      .populate('user', 'firstName lastName email phone')
      .populate('assignedArtist', 'firstName lastName avatar email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Custom order not found' });
    }

    // Allow owner or admin to view
    const isOwner = order.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error('Get custom order error:', error);
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
      date: new Date(),
    });

    await order.save();

    const updatedOrder = await CustomOrder.findById(order._id)
      .populate('user', 'firstName lastName email')
      .populate('assignedArtist', 'firstName lastName');

    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve custom order
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
    order.statusHistory.push({
      status: 'completed',
      note: 'Approved by customer',
      date: new Date(),
    });

    await order.save();

    const updatedOrder = await CustomOrder.findById(order._id)
      .populate('user', 'firstName lastName email')
      .populate('assignedArtist', 'firstName lastName');

    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get pricing options
// @route   GET /api/custom-orders/options
export const getCustomOrderOptions = async (req, res) => {
  try {
    res.json({
      success: true,
      options: {
        canvasSizes: ['8x10', '11x14', '12x16', '16x20', '18x24', '20x24', '24x30', '24x36', '30x40', '36x48', 'custom'],
        sketchStyles: ['pencil-sketch', 'charcoal-sketch', 'watercolor', 'oil-painting', 'digital-illustration', 'line-art', 'pop-art', 'caricature', 'realistic', 'abstract'],
        framingOptions: ['no-frame', 'basic-black', 'basic-white', 'wooden-natural', 'wooden-dark', 'golden-classic', 'silver-modern', 'floating-frame'],
        colorStyles: ['full-color', 'black-and-white', 'sepia', 'monochrome', 'vintage', 'vibrant', 'pastel', 'muted'],
        backgroundPreferences: ['keep-original', 'plain-white', 'plain-black', 'blurred', 'custom-color', 'scenic', 'abstract-pattern', 'none'],
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};