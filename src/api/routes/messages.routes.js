import { Router } from 'express';
import multer from 'multer';
import {
  listConversations,
  getMessages,
  sendMessage,
  markRead,
  getContactAvatar,
} from '../controllers/messages.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();
const chatUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 32 * 1024 * 1024 },
});

/** Accept either field name "media" or "file" */
function acceptChatMedia(req, res, next) {
  chatUpload.fields([
    { name: 'media', maxCount: 1 },
    { name: 'file', maxCount: 1 },
  ])(req, res, (err) => {
    if (err) return next(err);
    const f = req.files?.media?.[0] || req.files?.file?.[0];
    if (f) req.file = f;
    next();
  });
}

router.get('/accounts/:accountId/conversations', authenticate, listConversations);
router.get('/accounts/:accountId/chat/:phone', authenticate, getMessages);
router.get('/accounts/:accountId/contacts/:phone/avatar', authenticate, getContactAvatar);
router.post(
  '/accounts/:accountId/send',
  authenticate,
  requireRole(['supervisor', 'agent']),
  acceptChatMedia,
  sendMessage
);
router.post('/accounts/:accountId/chat/:phone/read', authenticate, markRead);

export default router;
