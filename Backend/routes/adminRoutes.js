import express from 'express';
import {
  getDashboardStats, getUsers, updateUser,
  getAllOrders, updateOrderStatus,
  getAllCustomOrders, updateCustomOrder, getArtists,
} from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = express.Router();

router.use(protect, admin);

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.get('/artists', getArtists);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/custom-orders', getAllCustomOrders);
router.put('/custom-orders/:id', updateCustomOrder);

export default router;