import { Router } from 'express';
import express from 'express';
import { verifyWhatsAppWebhook, receiveWhatsAppWebhook } from '../controllers/webhooks.controller.js';

const router = Router();

// GET — Meta verification handshake (no auth, no body parser)
router.get('/whatsapp', verifyWhatsAppWebhook);

// POST — Meta event delivery; raw body required for X-Hub-Signature-256 validation
router.post(
  '/whatsapp',
  express.raw({ type: 'application/json' }),
  receiveWhatsAppWebhook,
);

export default router;