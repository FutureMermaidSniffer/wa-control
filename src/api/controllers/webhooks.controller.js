import crypto from 'crypto';
import config from '../../config/index.js';
import { logger } from '../../utils/logger.js';

/**
 * Meta WhatsApp Cloud API — webhook verification (GET).
 * @see https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/create-webhook-endpoint
 */
export function verifyWhatsAppWebhook(req, res) {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (!config.WHATSAPP_VERIFY_TOKEN) {
    logger.error('WHATSAPP_VERIFY_TOKEN is not configured');
    return res.sendStatus(500);
  }

  if (mode === 'subscribe' && token === config.WHATSAPP_VERIFY_TOKEN) {
    logger.info('WhatsApp webhook verified by Meta');
    return res.status(200).send(challenge);
  }

  logger.warn('WhatsApp webhook verification failed', { mode, tokenMatch: token === config.WHATSAPP_VERIFY_TOKEN });
  return res.sendStatus(403);
}

function validateSignature(rawBody, signatureHeader) {
  if (!config.WHATSAPP_APP_SECRET) {
    logger.warn('WHATSAPP_APP_SECRET not set — skipping signature validation');
    return true;
  }

  if (!signatureHeader || !signatureHeader.startsWith('sha256=')) {
    return false;
  }

  const expected = signatureHeader.slice(7);
  const computed = crypto
    .createHmac('sha256', config.WHATSAPP_APP_SECRET)
    .update(rawBody)
    .digest('hex');

  try {
    return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(computed, 'hex'));
  } catch {
    return false;
  }
}

/**
 * Meta WhatsApp Cloud API — incoming events (POST).
 */
export function receiveWhatsAppWebhook(req, res) {
  const signature = req.get('X-Hub-Signature-256');
  const rawBody = req.body;

  if (!Buffer.isBuffer(rawBody)) {
    logger.error('WhatsApp webhook expected raw body buffer');
    return res.sendStatus(400);
  }

  if (!validateSignature(rawBody, signature)) {
    logger.warn('WhatsApp webhook signature validation failed');
    return res.sendStatus(403);
  }

  let payload;
  try {
    payload = JSON.parse(rawBody.toString('utf8'));
  } catch {
    return res.sendStatus(400);
  }

  const field = payload?.object;
  const entries = payload?.entry?.length ?? 0;
  logger.info('WhatsApp webhook event received', { object: field, entries });

  // Meta requires HTTP 200 to acknowledge; no body required.
  return res.sendStatus(200);
}