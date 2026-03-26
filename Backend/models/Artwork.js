import mongoose from 'mongoose';

const artworkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Artwork title is required'],
    trim: true,
    maxlength: 200,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: 2000,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  comparePrice: {
    type: Number,
    min: 0,
  },
  images: [{
    public_id: { type: String, required: true },
    url: { type: String, required: true },
    alt: String,
  }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required'],
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Artist is required'],
  },
  medium: {
    type: String,
    enum: ['oil', 'acrylic', 'watercolor', 'pencil', 'charcoal', 'digital', 'mixed-media', 'ink', 'pastel', 'other'],
    required: true,
  },
  style: {
    type: String,
    enum: ['realistic', 'abstract', 'impressionist', 'modern', 'contemporary', 'pop-art', 'minimalist', 'surreal', 'portrait', 'landscape', 'other'],
  },
  dimensions: {
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    unit: { type: String, enum: ['inches', 'cm'], default: 'inches' },
  },
  weight: {
    value: Number,
    unit: { type: String, enum: ['kg', 'lbs'], default: 'lbs' },
  },
  isFramed: {
    type: Boolean,
    default: false,
  },
  frameDetails: String,
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 1,
  },
  sold: {
    type: Number,
    default: 0,
  },
  tags: [{ type: String, trim: true }],
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 },
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  seoTitle: String,
  seoDescription: String,
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

artworkSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'artwork',
});

artworkSchema.virtual('isInStock').get(function () {
  return this.stock > 0;
});

artworkSchema.virtual('discountPercent').get(function () {
  if (this.comparePrice && this.comparePrice > this.price) {
    return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
  }
  return 0;
});

artworkSchema.pre('save', function () {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      + '-' + Date.now().toString(36);
  }
  // next();
});

artworkSchema.index({ slug: 1 });
artworkSchema.index({ category: 1 });
artworkSchema.index({ artist: 1 });
artworkSchema.index({ price: 1 });
artworkSchema.index({ 'ratings.average': -1 });
artworkSchema.index({ isFeatured: 1, isActive: 1 });
artworkSchema.index({ tags: 1 });
artworkSchema.index({ title: 'text', description: 'text', tags: 'text' });

const Artwork = mongoose.model('Artwork', artworkSchema);
export default Artwork;