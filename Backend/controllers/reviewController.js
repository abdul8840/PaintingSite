import Review from '../models/Review.js';
import Order from '../models/Order.js';

// @desc    Create review
// @route   POST /api/reviews
export const createReview = async (req, res) => {
  try {
    const { artwork, rating, title, comment } = req.body;

    // Check if already reviewed
    const existing = await Review.findOne({ user: req.user._id, artwork });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You already reviewed this artwork' });
    }

    // Check if purchased (verified purchase)
    const hasPurchased = await Order.findOne({
      user: req.user._id,
      'items.artwork': artwork,
      paymentStatus: 'paid',
    });

    const review = await Review.create({
      user: req.user._id,
      artwork,
      rating,
      title,
      comment,
      isVerifiedPurchase: !!hasPurchased,
    });

    const populated = await Review.findById(review._id).populate('user', 'firstName lastName avatar');

    res.status(201).json({ success: true, review: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get artwork reviews
// @route   GET /api/reviews/artwork/:artworkId
export const getArtworkReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'newest' } = req.query;

    let sortOption = {};
    switch (sort) {
      case 'newest': sortOption = { createdAt: -1 }; break;
      case 'oldest': sortOption = { createdAt: 1 }; break;
      case 'highest': sortOption = { rating: -1 }; break;
      case 'lowest': sortOption = { rating: 1 }; break;
      case 'helpful': sortOption = { helpfulCount: -1 }; break;
      default: sortOption = { createdAt: -1 };
    }

    const total = await Review.countDocuments({ artwork: req.params.artworkId, isApproved: true });
    const reviews = await Review.find({ artwork: req.params.artworkId, isApproved: true })
      .populate('user', 'firstName lastName avatar')
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Rating distribution
    const distribution = await Review.aggregate([
      { $match: { artwork: new (await import('mongoose')).default.Types.ObjectId(req.params.artworkId), isApproved: true } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: -1 } },
    ]);

    res.json({
      success: true,
      reviews,
      total,
      distribution,
      pagination: { page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark review helpful
// @route   PUT /api/reviews/:id/helpful
export const markHelpful = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpfulCount: 1 } },
      { new: true }
    );
    res.json({ success: true, helpfulCount: review.helpfulCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};