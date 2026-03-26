import express from 'express';
import {
  calculatePrice, createCustomOrder, getMyCustomOrders,
  getCustomOrderById, requestRevision, approveCustomOrder,
  getCustomOrderOptions,
} from '../controllers/customOrderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/options', getCustomOrderOptions);
router.post('/calculate-price', calculatePrice);

router.use(protect);

router.post('/', createCustomOrder);
router.get('/my-orders', getMyCustomOrders);
router.get('/:id', getCustomOrderById);
router.put('/:id/revision', requestRevision);
router.put('/:id/approve', approveCustomOrder);

export default router;