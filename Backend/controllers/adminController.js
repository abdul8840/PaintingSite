import mongoose from 'mongoose';
import User from '../models/User.js';
import Artwork from '../models/Artwork.js';
import Order from '../models/Order.js';
import CustomOrder from '../models/CustomOrder.js';
import Category from '../models/Category.js';
import { sendStatusUpdate } from '../utils/emailService.js';

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    // Run all queries in parallel
    const [
      totalUsers,
      totalArtworks,
      totalOrders,
      totalCustomOrders,
      pendingOrders,
      pendingCustomOrders,
      newUsersThisMonth,
    ] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      Artwork.countDocuments({ isActive: true }),
      Order.countDocuments(),
      CustomOrder.countDocuments(),
      Order.countDocuments({ orderStatus: { $in: ['pending', 'confirmed'] } }),
      CustomOrder.countDocuments({ status: { $in: ['pending', 'accepted'] } }),
      User.countDocuments({ createdAt: { $gte: thisMonthStart }, role: 'customer' }),
    ]);

    // Monthly revenue - artwork orders
    let monthlyArtworkRevenue = 0;
    const artworkRevenueResult = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          createdAt: { $gte: thisMonthStart },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
        },
      },
    ]);
    if (artworkRevenueResult.length > 0) {
      monthlyArtworkRevenue = artworkRevenueResult[0].total;
    }

    // Monthly revenue - custom orders
    let monthlyCustomRevenue = 0;
    const customRevenueResult = await CustomOrder.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          createdAt: { $gte: thisMonthStart },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
        },
      },
    ]);
    if (customRevenueResult.length > 0) {
      monthlyCustomRevenue = customRevenueResult[0].total;
    }

    const currentMonthRevenue = monthlyArtworkRevenue + monthlyCustomRevenue;

    // Last month revenue
    let lastMonthRevenue = 0;
    const lastMonthResult = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
          createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
        },
      },
    ]);
    if (lastMonthResult.length > 0) {
      lastMonthRevenue = lastMonthResult[0].total;
    }

    // Revenue growth percentage
    let revenueGrowth = 0;
    if (lastMonthRevenue > 0) {
      revenueGrowth = parseFloat(
        (((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1)
      );
    } else if (currentMonthRevenue > 0) {
      revenueGrowth = 100;
    }

    // Revenue chart - last 6 months
    let revenueChart = [];
    try {
      revenueChart = await Order.aggregate([
        {
          $match: {
            paymentStatus: 'paid',
            createdAt: { $gte: sixMonthsAgo },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            revenue: { $sum: '$totalAmount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]);
    } catch (err) {
      console.error('Revenue chart aggregation error:', err.message);
      revenueChart = [];
    }

    // Recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'firstName lastName email')
      .lean();

    // Recent custom orders
    const recentCustomOrders = await CustomOrder.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'firstName lastName email')
      .lean();

    // Top selling artworks
    const topArtworks = await Artwork.find({ isActive: true })
      .sort({ sold: -1 })
      .limit(5)
      .select('title sold price images slug')
      .lean();

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalArtworks,
        totalOrders: totalOrders + totalCustomOrders,
        monthlyRevenue: Math.round(currentMonthRevenue * 100) / 100,
        revenueGrowth,
        pendingOrders: pendingOrders + pendingCustomOrders,
        newUsersThisMonth,
        recentOrders,
        recentCustomOrders,
        topArtworks,
        revenueChart,
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const { role, search } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user role/status
// @route   PUT /api/admin/users/:id
export const updateUser = async (req, res) => {
  try {
    const { role, isActive } = req.body;
    const update = {};
    if (role !== undefined) update.role = role;
    if (isActive !== undefined) update.isActive = isActive;

    const user = await User.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/admin/orders
export const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const { status, paymentStatus } = req.query;

    const filter = {};
    if (status) filter.orderStatus = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .populate('user', 'firstName lastName email')
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

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber, trackingUrl, estimatedDelivery, note } = req.body;
    const order = await Order.findById(req.params.id).populate('user', 'email firstName lastName');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.orderStatus = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (trackingUrl) order.trackingUrl = trackingUrl;
    if (estimatedDelivery) order.estimatedDelivery = new Date(estimatedDelivery);
    if (status === 'delivered') order.deliveredAt = new Date();

    order.statusHistory.push({
      status,
      note: note || `Status updated to ${status}`,
      date: new Date(),
    });

    await order.save();

    if (order.user?.email) {
      try {
        await sendStatusUpdate(order.orderNumber, status, order.user.email);
      } catch (emailErr) {
        console.error('Email error:', emailErr.message);
      }
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all custom orders (admin)
// @route   GET /api/admin/custom-orders
export const getAllCustomOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const { status } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const total = await CustomOrder.countDocuments(filter);
    const orders = await CustomOrder.find(filter)
      .populate('user', 'firstName lastName email')
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

// @desc    Update custom order (admin)
// @route   PUT /api/admin/custom-orders/:id
export const updateCustomOrder = async (req, res) => {
  try {
    const { status, assignedArtist, progressImages, finalImage, note, trackingNumber } = req.body;
    const order = await CustomOrder.findById(req.params.id).populate('user', 'email firstName lastName');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Custom order not found' });
    }

    if (status) {
      order.status = status;
      order.statusHistory.push({
        status,
        note: note || `Status updated to ${status}`,
        updatedBy: req.user._id,
        date: new Date(),
      });
    }
    if (assignedArtist) order.assignedArtist = assignedArtist;
    if (progressImages && Array.isArray(progressImages)) {
      order.progressImages.push(...progressImages);
    }
    if (finalImage) order.finalImage = finalImage;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (status === 'delivered') order.deliveredAt = new Date();
    if (status === 'completed') order.completedAt = new Date();

    await order.save();

    // Re-populate after save
    const updatedOrder = await CustomOrder.findById(order._id)
      .populate('user', 'firstName lastName email')
      .populate('assignedArtist', 'firstName lastName');

    if (order.user?.email && status) {
      try {
        await sendStatusUpdate(order.orderNumber, status, order.user.email);
      } catch (emailErr) {
        console.error('Email error:', emailErr.message);
      }
    }

    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get artists list
// @route   GET /api/admin/artists
export const getArtists = async (req, res) => {
  try {
    const artists = await User.find({ role: 'artist', isActive: true })
      .select('firstName lastName email avatar artistSpecialties')
      .lean();
    res.json({ success: true, artists });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};