import { Router } from 'express';
import {
  listConversations,
  getMessages,
  sendMessage,
  markRead,
} from '../controllers/messages.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

// Conversations & messages for a specific WS account
router.get('/accounts/:accountId/conversations', authenticate, listConversations);
router.get('/accounts/:accountId/chat/:phone', authenticate, getMessages);
router.post('/accounts/:accountId/send', authenticate, requireRole(['supervisor', 'agent']), sendMessage);
router.post('/accounts/:accountId/chat/:phone/read', authenticate, markRead);

export default router;
