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
    // How many Waydroid/Android instances we allow to be starting/running at the same time.
    // For 50 active numbers you do NOT need 50 emulators.
    // Emulators are only needed during initial WhatsApp registration + Baileys pairing.
    // Once linked, the Baileys session runs headless in Node (no emulator required).
    // Typical: 2-6 concurrent slots depending on your VPS/hardware.
    this.maxConcurrent = parseInt(process.env.MAX_CONCURRENT_EMULATORS || '4', 10);
    this.currentConcurrent = 0;
  }

  /**
   * Create a new emulator record.
   * Supports two modes for transitional "phone-first" acquisition:
   *  - With wsAccountId (legacy / when account already exists)
   *  - With phone only (new: number acquired from GrizzlySMS etc., full ws_account + port allocated only on successful link)
   */
  async createEmulatorRecord({ wsAccountId = null, phone = null, host = 'localhost', metadata = {} } = {}) {
    if (!wsAccountId && !phone) {
      throw new Error('createEmulatorRecord requires either wsAccountId or phone');
    }

    const insertData = {
      ws_account_id: wsAccountId,
      phone,
      provider: this.provider,
      host,
      status: 'provisioning',
      metadata: {
        ...metadata,
        ...(phone && { phone_source: metadata.phone_source || 'manual_or_grizzly' }),
      },
    };

    const [emulator] = await db('cloud_emulators')
      .insert(insertData)
      .returning('*');

    logger.info('Created cloud emulator record', { emulatorId: emulator.id, wsAccountId, phone });
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

    if (this.currentConcurrent >= this.maxConcurrent) {
      throw new Error(`Too many concurrent emulators (max ${this.maxConcurrent}). Queue or wait. For 50 numbers you only need a small pool for onboarding/recovery.`);
    }
    this.currentConcurrent++;

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
    } finally {
      this.currentConcurrent = Math.max(0, this.currentConcurrent - 1);
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
      this.currentConcurrent = Math.max(0, this.currentConcurrent - 1);
      return { success: true };
    } catch (err) {
      logger.warn('Error stopping Waydroid (may already be stopped)', { emulatorId, error: err.message });
      await this.updateEmulator(emulatorId, { status: 'stopped' });
      this.currentConcurrent = Math.max(0, this.currentConcurrent - 1);
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
   * Supports transitional phone-first: if no ws_account yet (common for newly acquired Grizzly numbers),
   * we create a minimal ws_account (status 'pending_verification', no port allocated yet).
   * Full profile + port allocation happens on successful Baileys connection 'open'.
   */
  async linkWithPairingCode(emulatorId) {
    const emulator = await this.getEmulator(emulatorId);
    if (!emulator) throw new Error('Emulator not found');

    let account = null;

    if (emulator.ws_account_id) {
      account = await db('ws_accounts').where({ id: emulator.ws_account_id }).first();
    } else if (emulator.phone) {
      // Transitional phone-first path: create minimal account so we can request pairing code
      // and store baileys_auth_state. No port is allocated here.
      account = await db('ws_accounts').where({ phone: emulator.phone }).first();

      if (!account) {
        const [created] = await db('ws_accounts')
          .insert({
            phone: emulator.phone,
            status: 'pending_verification',
            acquisition_method: 'phone_assoc',
            // deliberately no port_id / proxy_id here
          })
          .returning('*');
        account = created;

        // Link the emulator record to the newly created (minimal) account
        await this.updateEmulator(emulatorId, { ws_account_id: account.id });
        logger.info('Created minimal ws_account for transitional phone-first flow (no port yet)', {
          phone: emulator.phone,
          accountId: account.id,
        });
      }
    }

    if (!account) throw new Error('Could not resolve or create ws_account for linking');

    await this.updateEmulator(emulatorId, { status: 'linking' });

    try {
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
        instructions: 'Enter this code in the WhatsApp app running inside the Waydroid session. Once linked you can stop the session. Port will be allocated on successful connection.',
        accountId: account.id,
      };
    } catch (err) {
      await this.updateEmulator(emulatorId, { status: 'error' });
      throw err;
    }
  }

  /**
   * Full convenience flow (high level).
   * Supports phone-first transitional + manual registration flows.
   *
   * If options.linkOnly === true (or metadata.alreadyRegistered), we SKIP
   * starting the emulator and installing WhatsApp. This is for the case where
   * the user ran their own emulator launcher with `--account <phone>` (or equivalent),
   * received the WhatsApp SMS code from the provider, and already completed
   * registration inside WhatsApp.
   *
   * In that case we go straight to creating the minimal account (if needed) and
   * requesting the Baileys pairing code.
   */
  async provisionAndLink(identifier, options = {}) {
    const createOpts = {};
    if (typeof identifier === 'string') {
      createOpts.wsAccountId = identifier;
    } else if (identifier && typeof identifier === 'object') {
      createOpts.wsAccountId = identifier.wsAccountId;
      createOpts.phone = identifier.phone;
    }
    if (options.phone && !createOpts.phone) createOpts.phone = options.phone;

    const emulator = await this.createEmulatorRecord({
      ...createOpts,
      host: options.host,
      metadata: options.metadata,
    });

    const isLinkOnly = options.linkOnly === true ||
                       options.assumeRegistered === true ||
                       emulator.metadata?.already_registered === true;

    if (!isLinkOnly) {
      await this.startWaydroidSession(emulator.id, options);
      await this.installWhatsApp(emulator.id, options.apkPath);
      // User must now complete WhatsApp registration using the SMS code from their provider.
    } else {
      await this.updateEmulator(emulator.id, {
        status: 'registered',
        metadata: {
          ...emulator.metadata,
          link_only: true,
          note: 'Emulator start/install skipped — registration assumed complete by operator (manual or external --account flow)',
        },
      });
    }

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
