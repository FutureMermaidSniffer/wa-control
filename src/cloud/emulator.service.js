/**
 * Emulator / Cloud Device Provisioning Service (LEGACY - Waydroid)
 *
 * Being phased out in favor of MoreLogin outsourced cloud phones.
 * See src/cloud/morelogin.service.js + docs/MORELOGIN_INTEGRATION_PLAN.md
 *
 * New flow (separate reg sequence):
 *   supplier (number + code) → MoreLogin cloud phone → register WA on it → Baileys link → power off
 */

import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import db from '../db/connection.js';
import { getSessionEngine } from '../core/engine/SessionEngine.js';
import { logger } from '../utils/logger.js';

const execAsync = promisify(exec);

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
   * Find an existing emulator record or create one.
   * Avoids duplicate-key errors on cloud_emulators.ws_account_id (one row per account).
   */
  async getOrCreateEmulatorRecord({ wsAccountId = null, phone = null, host = 'localhost', metadata = {} } = {}) {
    if (wsAccountId) {
      const existing = await db('cloud_emulators').where({ ws_account_id: wsAccountId }).first();
      if (existing) {
        logger.info('Reusing existing cloud emulator record', { emulatorId: existing.id, wsAccountId });
        return existing;
      }
    }

    if (phone) {
      const existing = await db('cloud_emulators')
        .where({ phone })
        .whereNot('status', 'released')
        .orderBy('created_at', 'desc')
        .first();
      if (existing) {
        if (wsAccountId && !existing.ws_account_id) {
          await this.updateEmulator(existing.id, { ws_account_id: wsAccountId });
          existing.ws_account_id = wsAccountId;
        }
        logger.info('Reusing existing cloud emulator record', { emulatorId: existing.id, phone });
        return existing;
      }
    }

    return this.createEmulatorRecord({ wsAccountId, phone, host, metadata });
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
   * Trigger the linking flow for phone primary or cloud emulator primary.
   * For phone primary (user registered on their phone): call --mark-registered first to set primary_registered.
   * For emulator: the registration happens in Waydroid.
   * Supports transitional phone-first: if no ws_account yet, creates minimal (status 'pending_verification' unless marked).
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
        const isTestNoPhone = emulator.phone === '+13185167435';
        const [created] = await db('ws_accounts')
          .insert({
            phone: emulator.phone,
            status: isTestNoPhone ? 'primary_registered' : 'pending_verification',
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
          status: isTestNoPhone ? 'primary_registered' : 'pending_verification',
        });
      }
    }

    if (!account) throw new Error('Could not resolve or create ws_account for linking');

    // Guard: for real numbers, the primary WhatsApp must be registered first (in cloud emulator or on phone).
    // Baileys can only link companions to already-registered primaries.
    const isTestNoPhone = account.phone === '+13185167435';
    if (!isTestNoPhone) {
      const em = await this.getEmulator(emulatorId);
      const accountReady = ['primary_registered', 'linked', 'offline', 'error'].includes(account.status);
      if (!em || (em.status !== 'registered' && !accountReady)) {
        throw new Error(`Primary WhatsApp for ${account.phone} has not been registered yet (emulator status=${em?.status}, account=${account?.status}). If using phone as primary, ensure --mark-registered was called after phone registration. For emulator, complete registration in cloud first.`);
      }
    }

    await this.updateEmulator(emulatorId, { status: 'linking' });

    // Revive account status if it went offline from prior failed pairing attempt (phone primary case)
    if (['offline', 'error'].includes(account.status)) {
      await db('ws_accounts').where({ id: account.id }).update({ status: 'primary_registered' });
      account.status = 'primary_registered';
      logger.info(`[LINK] Revived account status to primary_registered for re-pairing ${account.phone}`);
    }

    try {
      const code = await getSessionEngine().requestPairingCode(account.id, account.phone, {
        forceNew: emulator.status === 'error',
      });

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
        instructions: 'Enter this code in the WhatsApp app running inside the Waydroid session. Server logs will show huge banner + live reminders of the code. GET /sessions/pairing-codes for visibility. Once linked you can stop the session. Port allocated on open.',
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

    const emulator = await this.getOrCreateEmulatorRecord({
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

    // Special support for full-server simulation with no real phone (test number +13185167435)
    // This allows testing primary_registered -> linking flow entirely server-side using cloud + Baileys.
    if (createOpts.phone === '+13185167435' || emulator.phone === '+13185167435') {
      // Full server simulation for test number: fake primary registration complete.
      // No real WhatsApp is installed or run for this number.
      try {
        let acc = await db('ws_accounts').where({ phone: '+13185167435' }).first();
        if (!acc) {
          [acc] = await db('ws_accounts').insert({
            phone: '+13185167435',
            status: 'primary_registered',
            acquisition_method: 'phone_assoc',
            display_name: 'Test No-Phone Account'
          }).returning('*');
        } else {
          await db('ws_accounts').where({ phone: '+13185167435' }).update({ 
            status: 'primary_registered',
            display_name: acc.display_name || 'Test No-Phone Account'
          });
        }
        await this.updateEmulator(emulator.id, { 
          status: 'registered',
          ws_account_id: acc.id 
        });
      } catch (e) {
        logger.warn('[TEST] Failed to bootstrap test number', e.message);
      }
      logger.info('[TEST] +13185167435 treated as fully "primary_registered" with no actual WhatsApp install (simulation only). Baileys will still attempt the companion link, but there is no real primary on WhatsApp servers, so the handshake will fail (this is expected and useful for testing our code paths, error handling, proxy logic, and status machine in isolation).');
    }

    let linkResult;
    const isTestNoPhone = createOpts.phone === '+13185167435' || emulator.phone === '+13185167435';

    if (isTestNoPhone && (options.linkOnly || options.assumeRegistered)) {
      // Pure simulation for test number: do NOT call real linkWithPairingCode / Baileys.
      // This tests provisioning, emulator record, ws_account creation, status='primary_registered' only.
      // No real WA primary exists, so no actual companion link attempt or notification will happen.
      linkResult = {
        success: true,
        pairingCode: 'SIM-TEST-CODE-12345678',
        instructions: 'SIMULATION ONLY for +13185167435. No real primary exists on WhatsApp servers (we only faked our DB state). Use this to test server-side provisioning, status stages, and account creation. To test real Baileys linking + phone notification, register the number on a phone first.',
        accountId: (await db('ws_accounts').where({ phone: '+13185167435' }).first())?.id,
        simulation: true
      };
      logger.info('[TEST] Pure simulation: skipped real Baileys socket and handshake attempt. Only DB records created.');
    } else {
      linkResult = await this.linkWithPairingCode(emulator.id);

      if (isTestNoPhone) {
        logger.info('[TEST] Pairing code request completed for simulation number (real Baileys path executed). No real device will accept the code.');
      }
    }

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

  /**
   * Keep the Baileys socket alive while the operator enters the pairing code in WhatsApp.
   */
  waitForLink(accountId, timeoutMs = 180000) {
    const engine = getSessionEngine();
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        engine.manager?.pairingInProgress?.delete?.(accountId);
        cleanup();
        reject(new Error(
          'Timed out waiting for Baileys link. Enter the pairing code on the primary WhatsApp faster, or re-run to get a fresh code.'
        ));
      }, timeoutMs);

      const onConnected = ({ accountId: id }) => {
        if (id === accountId) {
          cleanup();
          resolve();
        }
      };

      const cleanup = () => {
        clearTimeout(timeout);
        engine.off('connected', onConnected);
      };

      engine.on('connected', onConnected);
    });
  }
}

export default EmulatorService;
