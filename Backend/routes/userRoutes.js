import express from 'express';
import {
  updateProfile, updatePassword, updateAvatar,
  addAddress, updateAddress, deleteAddress,
  toggleWishlist, getWishlist,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.put('/profile', updateProfile);
router.put('/password', updatePassword);
router.put('/avatar', uploadSingle, updateAvatar);

router.post('/addresses', addAddress);
router.put('/addresses/:addressId', updateAddress);
router.delete('/addresses/:addressId', deleteAddress);

router.get('/wishlist', getWishlist);
router.put('/wishlist/:artworkId', toggleWishlist);

export default router;