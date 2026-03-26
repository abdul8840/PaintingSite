import express from 'express';
import { sendMessage, getChatHistory } from '../controllers/chatbotController.js';
import { optionalAuth } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/message', aiLimiter, optionalAuth, sendMessage);
router.get('/history/:sessionId', optionalAuth, getChatHistory);

export default router;