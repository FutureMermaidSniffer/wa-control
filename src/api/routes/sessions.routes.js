import { Router } from 'express';
import {
  listSessions,
  connectNumber,
  reconnectSession,
  disconnectNumber,
  sendTestMessage,
  listPairingCodes,
  pairingDiagnostics,
  markRegistered,
  getQr,
} from '../controllers/sessions.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

// Protected - supervisor for management, later agents limited view
router.get('/sessions', authenticate, listSessions);
router.get('/sessions/pairing-codes', authenticate, listPairingCodes);
router.get('/sessions/pairing-diagnostics', authenticate, requireRole('supervisor'), pairingDiagnostics);
router.get('/sessions/:accountId/qr', authenticate, requireRole('supervisor'), getQr);
router.post('/sessions/connect', authenticate, requireRole('supervisor'), connectNumber);
/**
 * Safe reconnect — restore companion socket from baileys_auth_state.
 * Does NOT issue a pairing code or QR. Use after server restart / socket drop
 * when the multi-device link is still present on the phone.
 */
router.post('/sessions/:accountId/reconnect', authenticate, requireRole(['supervisor', 'agent']), reconnectSession);
router.post('/sessions/:accountId/disconnect', authenticate, requireRole(['supervisor', 'agent']), disconnectNumber);
router.post('/sessions/:accountId/test-send', authenticate, requireRole('supervisor'), sendTestMessage);

/**
 * Mark an account as primary_registered (ready for pairing code) or force-reset its status.
 *
 * Use when:
 *  - You have a number already registered on WhatsApp on your real phone → mark it so the system
 *    knows it's ready for linking via pairing code.
 *  - An account is stuck in 'linking' from a failed attempt and won't retry → reset it here.
 *
 * Body (all optional):
 *  { "status": "primary_registered" }   ← default, clears auth state, ready for fresh pairing
 *  { "status": "offline" }              ← mark as offline (e.g. before warming)
 */
router.post('/sessions/:accountId/mark-registered', authenticate, requireRole('supervisor'), markRegistered);

/**
 * For phone-less / cloud operation (see docs/CLOUD_PHONELESS.md):
 * Pass { "usePairingCode": true, "acquisitionMethod": "phone_assoc", "proxyId": "..." (optional) } 
 * in the /sessions/connect body.
 * If you omit proxyId, an active proxy will be auto-selected for the pairing attempt (recommended).
 * 
 * Instead of returning a QR code to scan, the API will return an 8-digit
 * pairing code. Enter this code directly inside the WhatsApp application
 * that is running inside your cloud Android emulator (or virtual device).
 * 
 * Visibility during testing (curl etc):
 *   GET /api/v1/sessions/pairing-codes   → returns pending codes + the proxy that will be used
 *   The server logs will clearly say "USING PROXY id=..." or "DIRECT" when the socket is created.
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
