import express from 'express';
import { validateCoupon, getCoupons, createCoupon, updateCoupon, deleteCoupon } from '../controllers/couponController.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = express.Router();

router.post('/validate', protect, validateCoupon);

router.get('/', protect, admin, getCoupons);
router.post('/', protect, admin, createCoupon);
router.put('/:id', protect, admin, updateCoupon);
router.delete('/:id', protect, admin, deleteCoupon);

export default router;