import mongoose from 'mongoose';

const customOrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderNumber: {
    type: String,
    unique: true,
  },
  referenceImage: {
    public_id: { type: String, required: true },
    url: { type: String, required: true },
  },
  additionalImages: [{
    public_id: String,
    url: String,
  }],
  canvasSize: {
    type: String,
    enum: ['8x10', '11x14', '12x16', '16x20', '18x24', '20x24', '24x30', '24x36', '30x40', '36x48', 'custom'],
    required: true,
  },
  customSize: {
    width: Number,
    height: Number,
    unit: { type: String, enum: ['inches', 'cm'], default: 'inches' },
  },
  colorStyle: {
    type: String,
    enum: ['full-color', 'black-and-white', 'sepia', 'monochrome', 'vintage', 'vibrant', 'pastel', 'muted'],
    required: true,
  },
  sketchStyle: {
    type: String,
    enum: ['pencil-sketch', 'charcoal-sketch', 'watercolor', 'oil-painting', 'digital-illustration', 'line-art', 'pop-art', 'caricature', 'realistic', 'abstract'],
    required: true,
  },
  framingOption: {
    type: String,
    enum: ['no-frame', 'basic-black', 'basic-white', 'wooden-natural', 'wooden-dark', 'golden-classic', 'silver-modern', 'floating-frame'],
    default: 'no-frame',
  },
  backgroundPreference: {
    type: String,
    enum: ['keep-original', 'plain-white', 'plain-black', 'blurred', 'custom-color', 'scenic', 'abstract-pattern', 'none'],
    default: 'keep-original',
  },
  customBackgroundColor: String,
  numberOfSubjects: {
    type: Number,
    default: 1,
    min: 1,
    max: 10,
  },
  additionalNotes: {
    type: String,
    maxlength: 1000,
  },
  // Pricing
  basePrice: { type: Number, required: true },
  sizeMultiplier: { type: Number, default: 1 },
  styleMultiplier: { type: Number, default: 1 },
  framingCost: { type: Number, default: 0 },
  subjectsCost: { type: Number, default: 0 },
  rushOrderCost: { type: Number, default: 0 },
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  coupon: {
    code: String,
    discount: Number,
  },
  tax: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  isRushOrder: {
    type: Boolean,
    default: false,
  },
  // Shipping
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'US' },
  },
  shippingCost: { type: Number, default: 0 },
  // Payment
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded', 'partially-refunded'],
    default: 'pending',
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  currency: { type: String, default: 'INR' },
  // Order status
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in-progress', 'review', 'revision-requested', 'completed', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending',
  },
  assignedArtist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  // Progress tracking
  progressImages: [{
    public_id: String,
    url: String,
    stage: String,
    uploadedAt: { type: Date, default: Date.now },
  }],
  finalImage: {
    public_id: String,
    url: String,
  },
  revisionCount: { type: Number, default: 0 },
  maxRevisions: { type: Number, default: 2 },
  estimatedCompletionDays: { type: Number, default: 14 },
  estimatedDelivery: Date,
  completedAt: Date,
  deliveredAt: Date,
  trackingNumber: String,
  // AI suggestions
  aiSuggestedStyles: [{
    style: String,
    confidence: Number,
    reason: String,
  }],
  statusHistory: [{
    status: String,
    date: { type: Date, default: Date.now },
    note: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  }],
}, {
  timestamps: true,
});

customOrderSchema.pre('save', function () {
  if (this.isNew) {
    this.orderNumber = 'SMC-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
  }
  // next();
});

customOrderSchema.index({ user: 1, createdAt: -1 });
customOrderSchema.index({ orderNumber: 1 });
customOrderSchema.index({ status: 1 });
customOrderSchema.index({ assignedArtist: 1 });

const CustomOrder = mongoose.model('CustomOrder', customOrderSchema);
export default CustomOrder;