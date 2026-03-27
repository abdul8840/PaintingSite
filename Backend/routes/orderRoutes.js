import express from 'express';
import {
  createOrder, verifyPayment, verifyCustomPayment,
  getMyOrders, getOrderById, trackOrder, cancelOrder,
} from '../controllers/orderController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/track/:orderNumber', optionalAuth, trackOrder);

router.use(protect);

router.post('/', createOrder);
router.post('/verify-payment', verifyPayment);
router.post('/verify-custom-payment', verifyCustomPayment);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);

export default router;