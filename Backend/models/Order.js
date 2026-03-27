import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  artwork: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artwork',
    required: true,
  },
  title: { 
    type: String, 
    required: true 
  },
  image: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true,
    min: 0,
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: 1 
  },
}, { _id: false });

const shippingAddressSchema = new mongoose.Schema({
  street: { 
    type: String, 
    required: true,
    trim: true,
  },
  city: { 
    type: String, 
    required: true,
    trim: true,
  },
  state: { 
    type: String, 
    required: true,
    trim: true,
  },
  zipCode: { 
    type: String, 
    required: true,
    trim: true,
  },
  country: { 
    type: String, 
    required: true,
    default: 'USA',
    trim: true,
  },
}, { _id: false });

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  note: String,
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  orderNumber: {
    type: String,
    unique: true,
    sparse: true,
  },
  items: {
    type: [orderItemSchema],
    required: true,
    validate: {
      validator: function(items) {
        return items && items.length > 0;
      },
      message: 'Order must have at least one item',
    },
  },
  shippingAddress: {
    type: shippingAddressSchema,
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
  shippingCost: {
    type: Number,
    default: 0,
    min: 0,
  },
  tax: {
    type: Number,
    default: 0,
    min: 0,
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
  },
  coupon: {
    code: {
      type: String,
      uppercase: true,
    },
    discount: {
      type: Number,
      min: 0,
    },
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: { type: String, default: 'INR' },
  paymentMethod: { type: String, enum: ['razorpay', 'cod'], default: 'razorpay' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  // Razorpay fields
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending',
    index: true,
  },
  trackingNumber: {
    type: String,
    trim: true,
  },
  trackingUrl: {
    type: String,
    trim: true,
  },
  estimatedDelivery: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  cancellationReason: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  statusHistory: {
    type: [statusHistorySchema],
    default: [],
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// ============================================
// PRE-SAVE HOOKS
// ============================================

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  try {
    if (this.isNew && !this.orderNumber) {
      let orderNumber;
      let isUnique = false;
      
      // Generate unique order number
      while (!isUnique) {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        orderNumber = `SM-${timestamp}-${random}`;
        
        // Check if order number already exists
        const existing = await this.constructor.findOne({ orderNumber });
        if (!existing) {
          isUnique = true;
        }
      }
      
      this.orderNumber = orderNumber;
    }
    
    // next();
  } catch (error) {
    next(error);
  }
});

// Add initial status to history
orderSchema.pre('save', function(next) {
  try {
    if (this.isNew && this.statusHistory.length === 0) {
      this.statusHistory.push({
        status: this.orderStatus,
        date: new Date(),
        note: 'Order created',
      });
    }
    // next();
  } catch (error) {
    next(error);
  }
});

// ============================================
// VIRTUALS
// ============================================

orderSchema.virtual('itemCount').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

orderSchema.virtual('orderAge').get(function() {
  if (!this.createdAt) return null;
  const now = new Date();
  const created = new Date(this.createdAt);
  const diffTime = Math.abs(now - created);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

orderSchema.virtual('canBeCancelled').get(function() {
  return !['shipped', 'delivered', 'cancelled'].includes(this.orderStatus);
});

orderSchema.virtual('canBeReturned').get(function() {
  if (this.orderStatus !== 'delivered' || !this.deliveredAt) return false;
  const now = new Date();
  const delivered = new Date(this.deliveredAt);
  const diffTime = Math.abs(now - delivered);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 30;
});

// ============================================
// METHODS
// ============================================

orderSchema.methods.updateStatus = function(status, note = '') {
  this.orderStatus = status;
  this.statusHistory.push({
    status,
    date: new Date(),
    note,
  });
  
  if (status === 'delivered') {
    this.deliveredAt = new Date();
  } else if (status === 'cancelled') {
    this.cancelledAt = new Date();
    if (note && !this.cancellationReason) {
      this.cancellationReason = note;
    }
  }
  
  return this.save();
};

orderSchema.methods.addTracking = function(trackingNumber, trackingUrl = '', estimatedDelivery = null) {
  this.trackingNumber = trackingNumber;
  if (trackingUrl) this.trackingUrl = trackingUrl;
  if (estimatedDelivery) this.estimatedDelivery = estimatedDelivery;
  
  if (this.orderStatus === 'confirmed' || this.orderStatus === 'processing') {
    this.orderStatus = 'shipped';
    this.statusHistory.push({
      status: 'shipped',
      date: new Date(),
      note: `Tracking number: ${trackingNumber}`,
    });
  }
  
  return this.save();
};

orderSchema.methods.getRefundAmount = function() {
  if (this.paymentStatus !== 'paid') return 0;
  
  if (!['shipped', 'delivered'].includes(this.orderStatus)) {
    return this.totalAmount;
  }
  
  return this.totalAmount - this.shippingCost;
};

// ============================================
// STATICS
// ============================================

orderSchema.statics.getUserStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: '$totalAmount' },
        completedOrders: {
          $sum: { $cond: [{ $eq: ['$orderStatus', 'delivered'] }, 1, 0] }
        },
        pendingOrders: {
          $sum: { 
            $cond: [
              { $in: ['$orderStatus', ['pending', 'confirmed', 'processing', 'shipped']] }, 
              1, 
              0
            ] 
          }
        },
        cancelledOrders: {
          $sum: { $cond: [{ $eq: ['$orderStatus', 'cancelled'] }, 1, 0] }
        },
      }
    }
  ]);
  
  return stats[0] || {
    totalOrders: 0,
    totalSpent: 0,
    completedOrders: 0,
    pendingOrders: 0,
    cancelledOrders: 0,
  };
};

orderSchema.statics.getRecentOrders = function(limit = 10) {
  return this.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'firstName lastName email')
    .lean();
};

orderSchema.statics.getOrdersByStatus = function(status, page = 1, limit = 20) {
  return this.find({ orderStatus: status })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('user', 'firstName lastName email')
    .lean();
};

orderSchema.statics.getRevenueStats = async function(startDate, endDate) {
  const match = {
    paymentStatus: 'paid',
    createdAt: {
      $gte: startDate || new Date(new Date().setDate(1)),
      $lte: endDate || new Date(),
    }
  };
  
  const stats = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalAmount' },
        totalOrders: { $sum: 1 },
        averageOrderValue: { $avg: '$totalAmount' },
        totalShipping: { $sum: '$shippingCost' },
        totalTax: { $sum: '$tax' },
        totalDiscount: { $sum: '$discount' },
      }
    }
  ]);
  
  return stats[0] || {
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    totalShipping: 0,
    totalTax: 0,
    totalDiscount: 0,
  };
};

// ============================================
// INDEXES
// ============================================

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1, createdAt: -1 });
orderSchema.index({ razorpayOrderId: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ user: 1, orderStatus: 1 });
orderSchema.index({ user: 1, paymentStatus: 1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;