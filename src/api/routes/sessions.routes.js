import { Router } from 'express';
import {
  listSessions,
  connectNumber,
  disconnectNumber,
  sendTestMessage,
} from '../controllers/sessions.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

// Protected - supervisor for management, later agents limited view
router.get('/sessions', authenticate, listSessions);
router.post('/sessions/connect', authenticate, requireRole('supervisor'), connectNumber);
router.post('/sessions/:accountId/disconnect', authenticate, requireRole(['supervisor', 'agent']), disconnectNumber);
router.post('/sessions/:accountId/test-send', authenticate, requireRole('supervisor'), sendTestMessage);

/**
 * For phone-less / cloud operation (see docs/CLOUD_PHONELESS.md):
 * Pass { "usePairingCode": true, "acquisitionMethod": "phone_assoc" } 
 * in the /sessions/connect body.
 * 
 * Instead of returning a QR code to scan, the API will return an 8-digit
 * pairing code. Enter this code directly inside the WhatsApp application
 * that is running inside your cloud Android emulator (or virtual device).
 * 
 * This allows full cloud / phone-less registration flows:
 * 1. Provision Android emulator in the cloud.
 * 2. Install WhatsApp + register the number (using virtual SMS providers).
 * 3. Call connect with usePairingCode.
 * 4. Enter the returned code in the emulator's WhatsApp app.
 * 5. Linking completes, auth state is saved in DB.
 * 6. You can now shut down the emulator — the Baileys session runs headless.
 */
export default router;
