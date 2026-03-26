import Artwork from '../models/Artwork.js';
import { validatePagination } from '../utils/validators.js';

// @desc    Get all artworks with filtering, sorting, pagination
// @route   GET /api/artworks
export const getArtworks = async (req, res) => {
  try {
    const { page, limit } = validatePagination(req.query.page, req.query.limit);
    const {
      category, artist, medium, style, minPrice, maxPrice,
      search, sort, featured, inStock, tags,
    } = req.query;

    const filter = { isActive: true };

    if (category) filter.category = category;
    if (artist) filter.artist = artist;
    if (medium) filter.medium = medium;
    if (style) filter.style = style;
    if (featured === 'true') filter.isFeatured = true;
    if (inStock === 'true') filter.stock = { $gt: 0 };

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (tags) {
      filter.tags = { $in: tags.split(',').map(t => t.trim()) };
    }

    if (search) {
      filter.$text = { $search: search };
    }

    // Sort options
    let sortOption = {};
    switch (sort) {
      case 'price-asc': sortOption = { price: 1 }; break;
      case 'price-desc': sortOption = { price: -1 }; break;
      case 'newest': sortOption = { createdAt: -1 }; break;
      case 'oldest': sortOption = { createdAt: 1 }; break;
      case 'popular': sortOption = { sold: -1 }; break;
      case 'rating': sortOption = { 'ratings.average': -1 }; break;
      case 'views': sortOption = { views: -1 }; break;
      default: sortOption = { createdAt: -1 };
    }

    const skip = (page - 1) * limit;
    const total = await Artwork.countDocuments(filter);

    const artworks = await Artwork.find(filter)
      .populate('category', 'name slug')
      .populate('artist', 'firstName lastName avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      artworks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single artwork by slug
// @route   GET /api/artworks/slug/:slug
export const getArtworkBySlug = async (req, res) => {
  try {
    const artwork = await Artwork.findOne({ slug: req.params.slug, isActive: true })
      .populate('category', 'name slug')
      .populate('artist', 'firstName lastName avatar artistBio artistSpecialties')
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'firstName lastName avatar' },
        options: { sort: { createdAt: -1 }, limit: 10 },
      });

    if (!artwork) {
      return res.status(404).json({ success: false, message: 'Artwork not found' });
    }

    // Increment views
    artwork.views += 1;
    await artwork.save();

    res.json({ success: true, artwork });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single artwork by ID
// @route   GET /api/artworks/:id
export const getArtworkById = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('artist', 'firstName lastName avatar artistBio')
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'firstName lastName avatar' },
        options: { sort: { createdAt: -1 } },
      });

    if (!artwork) {
      return res.status(404).json({ success: false, message: 'Artwork not found' });
    }

    res.json({ success: true, artwork });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get featured artworks
// @route   GET /api/artworks/featured
export const getFeaturedArtworks = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 8, 20);
    const artworks = await Artwork.find({ isFeatured: true, isActive: true, stock: { $gt: 0 } })
      .populate('category', 'name slug')
      .populate('artist', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.json({ success: true, artworks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get related artworks
// @route   GET /api/artworks/:id/related
export const getRelatedArtworks = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) {
      return res.status(404).json({ success: false, message: 'Artwork not found' });
    }

    const related = await Artwork.find({
      _id: { $ne: artwork._id },
      isActive: true,
      stock: { $gt: 0 },
      $or: [
        { category: artwork.category },
        { style: artwork.style },
        { tags: { $in: artwork.tags } },
      ],
    })
      .populate('artist', 'firstName lastName')
      .limit(6)
      .lean();

    res.json({ success: true, artworks: related });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create artwork (admin/artist)
// @route   POST /api/artworks
export const createArtwork = async (req, res) => {
  try {
    const artworkData = {
      ...req.body,
      artist: req.body.artist || req.user._id,
    };

    // Parse dimensions if string
    if (typeof artworkData.dimensions === 'string') {
      artworkData.dimensions = JSON.parse(artworkData.dimensions);
    }

    // Parse images if string
    if (typeof artworkData.images === 'string') {
      artworkData.images = JSON.parse(artworkData.images);
    }

    // Parse tags
    if (typeof artworkData.tags === 'string') {
      artworkData.tags = artworkData.tags.split(',').map(t => t.trim());
    }

    const artwork = await Artwork.create(artworkData);
    const populatedArtwork = await Artwork.findById(artwork._id)
      .populate('category', 'name slug')
      .populate('artist', 'firstName lastName');

    res.status(201).json({ success: true, artwork: populatedArtwork });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update artwork
// @route   PUT /api/artworks/:id
export const updateArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) {
      return res.status(404).json({ success: false, message: 'Artwork not found' });
    }

    // Check ownership for artists
    if (req.user.role === 'artist' && artwork.artist.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this artwork' });
    }

    if (typeof req.body.dimensions === 'string') req.body.dimensions = JSON.parse(req.body.dimensions);
    if (typeof req.body.images === 'string') req.body.images = JSON.parse(req.body.images);
    if (typeof req.body.tags === 'string') req.body.tags = req.body.tags.split(',').map(t => t.trim());

    const updated = await Artwork.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('category', 'name slug')
      .populate('artist', 'firstName lastName');

    res.json({ success: true, artwork: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete artwork
// @route   DELETE /api/artworks/:id
export const deleteArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) {
      return res.status(404).json({ success: false, message: 'Artwork not found' });
    }

    await Artwork.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Artwork deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get artwork filters (for sidebar)
// @route   GET /api/artworks/filters/options
export const getFilterOptions = async (req, res) => {
  try {
    const [priceRange, mediums, styles] = await Promise.all([
      Artwork.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, minPrice: { $min: '$price' }, maxPrice: { $max: '$price' } } },
      ]),
      Artwork.distinct('medium', { isActive: true }),
      Artwork.distinct('style', { isActive: true }),
    ]);

    res.json({
      success: true,
      filters: {
        priceRange: priceRange[0] || { minPrice: 0, maxPrice: 10000 },
        mediums,
        styles,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};