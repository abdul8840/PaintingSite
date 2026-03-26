import express from 'express';
import {
  createOrder, getMyOrders, getOrderById,
  trackOrder, cancelOrder, verifySession,
} from '../controllers/orderController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Webhook is mounted directly on app in server.js before json parser
// DO NOT add webhook route here

router.get('/track/:orderNumber', optionalAuth, trackOrder);

router.use(protect);

router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/verify-session/:sessionId', verifySession);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);

export default router;