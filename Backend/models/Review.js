import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  artwork: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artwork',
    required: true,
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5,
  },
  title: {
    type: String,
    trim: true,
    maxlength: 100,
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    maxlength: 1000,
  },
  images: [{
    public_id: String,
    url: String,
  }],
  isVerifiedPurchase: {
    type: Boolean,
    default: false,
  },
  helpfulCount: {
    type: Number,
    default: 0,
  },
  isApproved: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

reviewSchema.index({ artwork: 1, user: 1 }, { unique: true });

reviewSchema.statics.calculateAverageRating = async function (artworkId) {
  const stats = await this.aggregate([
    { $match: { artwork: artworkId, isApproved: true } },
    {
      $group: {
        _id: '$artwork',
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await mongoose.model('Artwork').findByIdAndUpdate(artworkId, {
      'ratings.average': Math.round(stats[0].avgRating * 10) / 10,
      'ratings.count': stats[0].count,
    });
  } else {
    await mongoose.model('Artwork').findByIdAndUpdate(artworkId, {
      'ratings.average': 0,
      'ratings.count': 0,
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calculateAverageRating(this.artwork);
});

reviewSchema.post('findOneAndDelete', function (doc) {
  if (doc) {
    doc.constructor.calculateAverageRating(doc.artwork);
  }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;