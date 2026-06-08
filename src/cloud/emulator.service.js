/**
 * Emulator / Cloud Device Provisioning Service
 *
 * Purpose: Help run WhatsApp in the cloud (e.g. Waydroid) for phone-less registration,
 * then link it to wa-control via pairing code (no physical phone needed after registration).
 *
 * This is a starting point / controller. Full production use requires:
 * - Proper orchestration (Docker, Kubernetes, or dedicated emulator hosts)
 * - Virtual number provider integration for SMS
 * - UI automation or ADB scripting inside the emulator for registration flow
 * - Monitoring and resource management
 *
 * Current focus: Waydroid on Linux hosts (headless-friendly).
 */

import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import db from '../db/connection.js';
import SessionManager from '../core/sessions/SessionManager.js';
import { logger } from '../utils/logger.js';

const execAsync = promisify(exec);

const sessionManager = new SessionManager(db);

export class EmulatorService {
  constructor() {
    this.provider = 'waydroid';
  }

  /**
   * Create a new emulator record for a ws_account.
   * Call this before provisioning.
   */
  async createEmulatorRecord(wsAccountId, host = 'localhost', metadata = {}) {
    const [emulator] = await db('cloud_emulators')
      .insert({
        ws_account_id: wsAccountId,
        provider: this.provider,
        host,
        status: 'provisioning',
        metadata,
      })
      .returning('*');

    logger.info('Created cloud emulator record', { emulatorId: emulator.id, wsAccountId });
    return emulator;
  }

  /**
   * Get emulator record
   */
  async getEmulator(emulatorId) {
    return db('cloud_emulators').where({ id: emulatorId }).first();
  }

  /**
   * Update status and metadata
   */
  async updateEmulator(emulatorId, patch) {
    const [updated] = await db('cloud_emulators')
      .where({ id: emulatorId })
      .update({
        ...patch,
        updated_at: db.fn.now(),
      })
      .returning('*');
    return updated;
  }

  /**
   * Start a Waydroid session (headless friendly).
   *
   * This version prefers `xvfb-run` to avoid the error you saw:
   * "Wayland socket '/run/user/1000/wayland-0' doesn't exist; are you running a Wayland compositor?"
   *
   * Prerequisites:
   *   - waydroid installed + kernel support
   *   - `apt install xvfb` (or equivalent)
   *
   * For production you should run Waydroid under a proper supervisor (systemd, docker, etc.)
   * and just call status / start when needed.
   */
  async startWaydroidSession(emulatorId, options = {}) {
    const emulator = await this.getEmulator(emulatorId);
    if (!emulator) throw new Error('Emulator not found');

    await this.updateEmulator(emulatorId, { status: 'starting' });

    // Use xvfb-run for headless operation by default.
    // This provides a virtual X11 display so Waydroid doesn't require a real Wayland/X compositor.
    const cmd = options.useXvfb !== false
      ? 'xvfb-run --auto-servernum --server-args="-screen 0 1280x720x24" waydroid session start'
      : 'waydroid session start';

    const env = {
      ...process.env,
      WAYLAND_DISPLAY: options.waylandDisplay || 'wayland-0',
      ...options.env,
    };

    try {
      const { stdout, stderr } = await execAsync(cmd, { env, timeout: 20000 });

      logger.info('Waydroid session start output', { emulatorId, cmd, stdout, stderr });

      const sessionName = `waydroid-${emulatorId.slice(0, 8)}`;

      await this.updateEmulator(emulatorId, {
        status: 'running',
        session_name: sessionName,
        last_started_at: db.fn.now(),
        metadata: {
          ...emulator.metadata,
          started_with_cmd: cmd,
          started_with_env: env,
          start_output: stdout,
        },
      });

      return {
        success: true,
        sessionName,
        note: 'Using xvfb-run for headless. If you still see Wayland errors, ensure xvfb is installed and the host has proper binder/ashmem kernel modules.',
      };
    } catch (err) {
      await this.updateEmulator(emulatorId, { status: 'error' });
      logger.error('Failed to start Waydroid session', { emulatorId, error: err.message, stderr: err.stderr });
      throw err;
    }
  }

  /**
   * Stop the Waydroid session. Safe to call after linking is complete.
   */
  async stopWaydroidSession(emulatorId) {
    const emulator = await this.getEmulator(emulatorId);
    if (!emulator) throw new Error('Emulator not found');

    try {
      await execAsync('waydroid session stop');
      await this.updateEmulator(emulatorId, {
        status: 'stopped',
        metadata: { ...emulator.metadata, stopped_at: new Date().toISOString() },
      });
      logger.info('Waydroid session stopped', { emulatorId });
      return { success: true };
    } catch (err) {
      logger.warn('Error stopping Waydroid (may already be stopped)', { emulatorId, error: err.message });
      await this.updateEmulator(emulatorId, { status: 'stopped' });
      return { success: false, error: err.message };
    }
  }

  /**
   * Install WhatsApp inside the running Waydroid session.
   * Uses `waydroid app install` (APK must be available on the host or downloadable).
   */
  async installWhatsApp(emulatorId, apkPath = '/opt/whatsapp.apk') {
    const emulator = await this.getEmulator(emulatorId);
    if (!emulator || emulator.status !== 'running') {
      throw new Error('Emulator must be running to install apps');
    }

    try {
      // In real usage you would download the latest WhatsApp APK first
      const { stdout } = await execAsync(`waydroid app install ${apkPath}`);
      logger.info('WhatsApp install output', { emulatorId, stdout });

      await this.updateEmulator(emulatorId, {
        status: 'registered', // or a more granular status
        metadata: { ...emulator.metadata, whatsapp_installed: true, apk: apkPath },
      });

      return { success: true };
    } catch (err) {
      logger.error('WhatsApp install failed', { emulatorId, error: err.message });
      throw err;
    }
  }

  /**
   * Trigger the phone-less linking flow.
   * This starts the Baileys socket for the account and returns a pairing code
   * that you (or automation) will enter inside the WhatsApp app in the emulator.
   */
  async linkWithPairingCode(emulatorId) {
    const emulator = await this.getEmulator(emulatorId);
    if (!emulator) throw new Error('Emulator not found');

    const account = await db('ws_accounts').where({ id: emulator.ws_account_id }).first();
    if (!account) throw new Error('Associated ws_account not found');

    await this.updateEmulator(emulatorId, { status: 'linking' });

    try {
      // This uses the new pairing code support we added for cloud flows
      const code = await sessionManager.requestPairingCode(account.id, account.phone);

      await this.updateEmulator(emulatorId, {
        status: 'linked',
        last_linked_at: db.fn.now(),
        metadata: {
          ...emulator.metadata,
          pairing_code_used: code,
          linked_at: new Date().toISOString(),
        },
      });

      logger.info('Pairing code issued for cloud emulator', { emulatorId, code });

      return {
        success: true,
        pairingCode: code,
        instructions: 'Enter this code in the WhatsApp app running inside the Waydroid session. Once linked you can stop the session.',
      };
    } catch (err) {
      await this.updateEmulator(emulatorId, { status: 'error' });
      throw err;
    }
  }

  /**
   * Full convenience flow (high level).
   * In production you would break this into steps with UI/automation hooks.
   */
  async provisionAndLink(wsAccountId, options = {}) {
    const emulator = await this.createEmulatorRecord(wsAccountId, options.host, options.metadata);

    await this.startWaydroidSession(emulator.id, options);
    await this.installWhatsApp(emulator.id, options.apkPath);

    // At this point the user (or script) should have registered the number inside the emulator
    // using a virtual SMS provider.

    const linkResult = await this.linkWithPairingCode(emulator.id);

    return {
      emulator,
      linkResult,
    };
  }

  /**
   * Cleanup / stop and mark as done.
   * Call this after successful linking.
   */
  async shutdownEmulator(emulatorId) {
    await this.stopWaydroidSession(emulatorId);
    // Optionally you can leave the record for audit
    return this.updateEmulator(emulatorId, { status: 'stopped' });
  }
}

export default EmulatorService;
