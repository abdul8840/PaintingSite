import express from 'express';
import { suggestStyle } from '../controllers/aiController.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/suggest-style', aiLimiter, suggestStyle);

export default router;