import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  trackOrder,
  cancelOrder,
  verifySession,
} from '../controllers/orderController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/track/:orderNumber', optionalAuth, trackOrder);

// Protected routes
router.use(protect);

router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/verify-session/:sessionId', verifySession);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);

export default router;