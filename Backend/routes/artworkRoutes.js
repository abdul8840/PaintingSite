import express from 'express';
import {
  getArtworks, getArtworkBySlug, getArtworkById,
  getFeaturedArtworks, getRelatedArtworks, getFilterOptions,
  createArtwork, updateArtwork, deleteArtwork,
} from '../controllers/artworkController.js';
import { protect } from '../middleware/auth.js';
import { artistOrAdmin } from '../middleware/admin.js';

const router = express.Router();

router.get('/filters/options', getFilterOptions);
router.get('/featured', getFeaturedArtworks);
router.get('/', getArtworks);
router.get('/slug/:slug', getArtworkBySlug);
router.get('/:id', getArtworkById);
router.get('/:id/related', getRelatedArtworks);

router.post('/', protect, artistOrAdmin, createArtwork);
router.put('/:id', protect, artistOrAdmin, updateArtwork);
router.delete('/:id', protect, artistOrAdmin, deleteArtwork);

export default router;