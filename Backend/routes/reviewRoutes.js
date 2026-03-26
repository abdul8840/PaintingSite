import express from 'express';
import { createReview, getArtworkReviews, deleteReview, markHelpful } from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/artwork/:artworkId', getArtworkReviews);
router.put('/:id/helpful', markHelpful);

router.post('/', protect, createReview);
router.delete('/:id', protect, deleteReview);

export default router;