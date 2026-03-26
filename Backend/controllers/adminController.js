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
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      totalUsers,
      totalArtworks,
      totalOrders,
      totalCustomOrders,
      monthlyRevenue,
      lastMonthRevenue,
      pendingOrders,
      pendingCustomOrders,
      recentOrders,
      recentCustomOrders,
      newUsersThisMonth,
      topArtworks,
    ] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      Artwork.countDocuments({ isActive: true }),
      Order.countDocuments(),
      CustomOrder.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: 'paid', createdAt: { $gte: thisMonth } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.aggregate([
        { $match: { paymentStatus: 'paid', createdAt: { $gte: lastMonth, $lt: thisMonth } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.countDocuments({ orderStatus: { $in: ['pending', 'confirmed'] } }),
      CustomOrder.countDocuments({ status: { $in: ['pending', 'accepted'] } }),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'firstName lastName').lean(),
      CustomOrder.find().sort({ createdAt: -1 }).limit(5).populate('user', 'firstName lastName').lean(),
      User.countDocuments({ createdAt: { $gte: thisMonth }, role: 'customer' }),
      Artwork.find({ isActive: true }).sort({ sold: -1 }).limit(5).select('title sold price images').lean(),
    ]);

    // Monthly revenue chart data (last 6 months)
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const revenueChart = await Order.aggregate([
      { $match: { paymentStatus: 'paid', createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Custom order revenue
    const customRevenue = await CustomOrder.aggregate([
      { $match: { paymentStatus: 'paid', createdAt: { $gte: thisMonth } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    const currentRevenue = (monthlyRevenue[0]?.total || 0) + (customRevenue[0]?.total || 0);
    const prevRevenue = lastMonthRevenue[0]?.total || 0;
    const revenueGrowth = prevRevenue ? ((currentRevenue - prevRevenue) / prevRevenue * 100).toFixed(1) : 100;

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalArtworks,
        totalOrders: totalOrders + totalCustomOrders,
        monthlyRevenue: currentRevenue,
        revenueGrowth: parseFloat(revenueGrowth),
        pendingOrders: pendingOrders + pendingCustomOrders,
        newUsersThisMonth,
        recentOrders,
        recentCustomOrders,
        topArtworks,
        revenueChart,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
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
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    res.json({ success: true, users, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } });
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
    if (role) update.role = role;
    if (isActive !== undefined) update.isActive = isActive;

    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/admin/orders
export const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, paymentStatus, sort = '-createdAt' } = req.query;
    const filter = {};
    if (status) filter.orderStatus = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .populate('user', 'firstName lastName email')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    res.json({ success: true, orders, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber, trackingUrl, estimatedDelivery, note } = req.body;
    const order = await Order.findById(req.params.id).populate('user', 'email');

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.orderStatus = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (trackingUrl) order.trackingUrl = trackingUrl;
    if (estimatedDelivery) order.estimatedDelivery = estimatedDelivery;
    if (status === 'delivered') order.deliveredAt = new Date();

    order.statusHistory.push({ status, note: note || `Status updated to ${status}` });
    await order.save();

    // Send email notification
    if (order.user?.email) {
      await sendStatusUpdate(order.orderNumber, status, order.user.email);
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
    const { page = 1, limit = 20, status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const total = await CustomOrder.countDocuments(filter);
    const orders = await CustomOrder.find(filter)
      .populate('user', 'firstName lastName email')
      .populate('assignedArtist', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    res.json({ success: true, orders, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update custom order (admin)
// @route   PUT /api/admin/custom-orders/:id
export const updateCustomOrder = async (req, res) => {
  try {
    const { status, assignedArtist, progressImages, finalImage, note, trackingNumber } = req.body;
    const order = await CustomOrder.findById(req.params.id).populate('user', 'email');

    if (!order) return res.status(404).json({ success: false, message: 'Custom order not found' });

    if (status) {
      order.status = status;
      order.statusHistory.push({
        status,
        note: note || `Status updated to ${status}`,
        updatedBy: req.user._id,
      });
    }
    if (assignedArtist) order.assignedArtist = assignedArtist;
    if (progressImages) order.progressImages.push(...progressImages);
    if (finalImage) order.finalImage = finalImage;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (status === 'delivered') order.deliveredAt = new Date();
    if (status === 'completed') order.completedAt = new Date();

    await order.save();

    if (order.user?.email) {
      await sendStatusUpdate(order.orderNumber, status, order.user.email);
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get artists list
// @route   GET /api/admin/artists
export const getArtists = async (req, res) => {
  try {
    const artists = await User.find({ role: 'artist', isActive: true }).select('firstName lastName email avatar artistSpecialties').lean();
    res.json({ success: true, artists });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};