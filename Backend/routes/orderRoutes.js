import express from 'express';
import {
  createOrder, getMyOrders, getOrderById,
  trackOrder, cancelOrder, stripeWebhook, verifySession,
} from '../controllers/orderController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

router.use('/track/:orderNumber', optionalAuth);
router.get('/track/:orderNumber', trackOrder);

router.use(protect);

router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/verify-session/:sessionId', verifySession);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);

export default router;