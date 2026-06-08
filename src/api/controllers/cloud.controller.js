import EmulatorService from '../../cloud/emulator.service.js';
import db from '../../db/connection.js';
import { logger } from '../../utils/logger.js';

const emulatorService = new EmulatorService();

/**
 * Cloud / Emulator provisioning endpoints.
 * These are the "controller" layer that the user asked for.
 *
 * They wrap the EmulatorService and integrate with the existing
 * ws_accounts + pairing code flow.
 */

export async function listEmulators(req, res, next) {
  try {
    const { ws_account_id } = req.query;
    let q = db('cloud_emulators').select('*').orderBy('created_at', 'desc');
    if (ws_account_id) q = q.where({ ws_account_id });
    const emulators = await q;
    res.json({ data: emulators });
  } catch (e) { next(e); }
}

export async function getEmulator(req, res, next) {
  try {
    const emulator = await emulatorService.getEmulator(req.params.id);
    if (!emulator) return res.status(404).json({ error: 'Emulator not found' });
    res.json({ data: emulator });
  } catch (e) { next(e); }
}

export async function provisionEmulator(req, res, next) {
  try {
    const { ws_account_id, host, metadata = {} } = req.body;
    if (!ws_account_id) return res.status(400).json({ error: 'ws_account_id is required' });

    const account = await db('ws_accounts').where({ id: ws_account_id }).first();
    if (!account) return res.status(404).json({ error: 'ws_account not found' });

    // Create record
    const emulator = await emulatorService.createEmulatorRecord(ws_account_id, host || 'localhost', metadata);

    // Kick off provisioning (this is async in real life — use a job queue for long ops)
    // For now we do the high-level steps synchronously for demo purposes.
    // In production: queue this and return 202 Accepted.
    try {
      const result = await emulatorService.provisionAndLink(ws_account_id, {
        host: host || 'localhost',
        metadata,
      });

      res.status(201).json({
        data: {
          emulator: result.emulator,
          pairingCode: result.linkResult.pairingCode,
          instructions: result.linkResult.instructions,
        },
        message: 'Waydroid provisioning started. Enter the pairing code in the emulator to complete linking.',
      });
    } catch (provisionErr) {
      await emulatorService.updateEmulator(emulator.id, { status: 'error' });
      throw provisionErr;
    }
  } catch (e) { next(e); }
}

export async function startEmulator(req, res, next) {
  try {
    const result = await emulatorService.startWaydroidSession(req.params.id);
    res.json({ data: result });
  } catch (e) { next(e); }
}

export async function stopEmulator(req, res, next) {
  try {
    const result = await emulatorService.stopWaydroidSession(req.params.id);
    res.json({ data: result });
  } catch (e) { next(e); }
}

export async function linkEmulator(req, res, next) {
  try {
    const result = await emulatorService.linkWithPairingCode(req.params.id);
    res.json({ data: result });
  } catch (e) { next(e); }
}

export async function shutdownEmulator(req, res, next) {
  try {
    const result = await emulatorService.shutdownEmulator(req.params.id);
    res.json({ data: result });
  } catch (e) { next(e); }
}
