import { Router } from 'express';
import {
  listEmulators,
  getEmulator,
  provisionEmulator,
  startEmulator,
  stopEmulator,
  linkEmulator,
  shutdownEmulator,
} from '../controllers/cloud.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

/**
 * Cloud Emulator / Waydroid Provisioning API
 *
 * These endpoints allow you to manage Android emulator instances (primarily Waydroid)
 * used for phone-less WhatsApp registration and linking.
 *
 * Flow for phone-less operation:
 *   1. POST /cloud/emulators/provision   (with ws_account_id)
 *   2. (Inside emulator) install WhatsApp + register number
 *   3. The provision call will return a pairing code
 *   4. Enter the code in the emulator's WhatsApp app
 *   5. POST /cloud/emulators/:id/shutdown  (or stop)
 *
 * All routes require supervisor (or admin) role.
 */

// List all emulators (optionally filter by ws_account_id)
router.get('/cloud/emulators', authenticate, requireRole('supervisor'), listEmulators);

// Get single emulator + current metadata
router.get('/cloud/emulators/:id', authenticate, requireRole('supervisor'), getEmulator);

// High-level: create emulator record + start Waydroid + install WhatsApp + trigger pairing code
router.post('/cloud/emulators/provision', authenticate, requireRole('supervisor'), provisionEmulator);

// Lower-level control (useful for debugging / step-by-step)
router.post('/cloud/emulators/:id/start', authenticate, requireRole('supervisor'), startEmulator);
router.post('/cloud/emulators/:id/stop', authenticate, requireRole('supervisor'), stopEmulator);
router.post('/cloud/emulators/:id/link', authenticate, requireRole('supervisor'), linkEmulator);
router.post('/cloud/emulators/:id/shutdown', authenticate, requireRole('supervisor'), shutdownEmulator);

export default router;
