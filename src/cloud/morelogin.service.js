/**
 * MoreLogin Cloud Phone Service (High-level)
 *
 * Replaces Waydroid EmulatorService for the new outsourced cloud emulator.
 * Implements the fully separate registration sequence:
 *   acquire (supplier) → create cloud phone + install WA → enter number+code on device → mark registered → Baileys link → power off
 *
 * All heavy lifting stays in Baileys + warming after the primary is registered.
 */

import MoreLoginClient from './morelogin.client.js';
import db from '../db/connection.js';
import { logger } from '../utils/logger.js';
import SessionManager from '../core/sessions/SessionManager.js';

const sessionManager = new SessionManager(db);

const client = new MoreLoginClient();

export class MoreLoginService {
  constructor() {
    this.client = client;
    this.maxConcurrent = parseInt(process.env.MAX_CONCURRENT_CLOUD_PHONES || '3', 10);
    this.currentConcurrent = 0;
  }

  // === DB record helpers (phone-first compatible with old schema) ===

  async createEmulatorRecord({ wsAccountId = null, phone = null, moreloginId = null, host = 'morelogin', metadata = {} } = {}) {
    if (!wsAccountId && !phone) {
      throw new Error('createEmulatorRecord requires wsAccountId or phone');
    }
    const insert = {
      ws_account_id: wsAccountId,
      phone,
      provider: 'morelogin',
      host,
      status: 'provisioning',
      morelogin_id: moreloginId,
      metadata: {
        ...metadata,
        provider: 'morelogin',
        created_via: 'morelogin.service',
      },
    };
    const [row] = await db('cloud_emulators').insert(insert).returning('*');
    logger.info('MoreLogin emulator record created', { id: row.id, phone, moreloginId });
    return row;
  }

  async getOrCreateEmulatorRecord({ wsAccountId = null, phone = null, moreloginId = null, metadata = {} }) {
    if (moreloginId) {
      const ex = await db('cloud_emulators').where({ morelogin_id: moreloginId }).first();
      if (ex) return ex;
    }
    if (phone) {
      const ex = await db('cloud_emulators')
        .where({ phone })
        .whereNot('status', 'released')
        .orderBy('created_at', 'desc')
        .first();
      if (ex) {
        if (moreloginId && !ex.morelogin_id) {
          await this.updateEmulator(ex.id, { morelogin_id: moreloginId });
          ex.morelogin_id = moreloginId;
        }
        return ex;
      }
    }
    if (wsAccountId) {
      const ex = await db('cloud_emulators').where({ ws_account_id: wsAccountId }).first();
      if (ex) return ex;
    }
    return this.createEmulatorRecord({ wsAccountId, phone, moreloginId, metadata });
  }

  async getEmulator(idOrMlId) {
    if (/^\d+$/.test(String(idOrMlId))) {
      // looks like morelogin numeric id
      const byMl = await db('cloud_emulators').where({ morelogin_id: String(idOrMlId) }).first();
      if (byMl) return byMl;
    }
    return db('cloud_emulators').where({ id: idOrMlId }).first() ||
           db('cloud_emulators').where({ morelogin_id: idOrMlId }).first();
  }

  async updateEmulator(emulatorId, patch) {
    const [updated] = await db('cloud_emulators')
      .where({ id: emulatorId })
      .update({ ...patch, updated_at: db.fn.now() })
      .returning('*');
    return updated;
  }

  async updateByMoreloginId(moreloginId, patch) {
    const [updated] = await db('cloud_emulators')
      .where({ morelogin_id: moreloginId })
      .update({ ...patch, updated_at: db.fn.now() })
      .returning('*');
    return updated;
  }

  // === Core lifecycle ===

  /**
   * Reliable, predictable way to start a MoreLogin cloud phone.
   * Based on docs:
   * - Ensure proxy is set (pass proxyId at powerOn or use setProxy first).
   * - powerOn
   * - Poll info until envStatus === 4 (started)
   * - Handle common errors (proxy, balance, status 3=starting)
   */
  /**
   * Predictable and consistent way to start a MoreLogin cloud phone.
   * Based on official docs:
   * - Check current envStatus via /info
   * - Ensure proxy is bound (use proxyId at powerOn or setProxy first)
   * - Call powerOn (with proxyId)
   * - Poll /info until envStatus === 4 (ready)
   * - Handle 2=stopped, 3=starting, errors
   * - Always prefer passing proxyId when known.
   */
  /**
   * Predictable, consistent way to start a cloud phone.
   * Follows the MoreLogin docs:
   * 1. Check current envStatus (2=stopped, 3=starting, 4=ready).
   * 2. Bind proxy if the device/account requires one (use proxyId at powerOn or setProxy).
   * 3. Call powerOn (preferably with proxyId).
   * 4. Poll getDeviceInfo until envStatus === 4, with retries and clear logging.
   * 5. Fail fast on bad states or timeout.
   *
   * For manual start in the UI: just confirm status===4 before proceeding.
   * Always use a valid proxyId from your account for devices that need it.
   */
  async ensureStarted(moreloginId, { proxyId = null, maxWaitSec = 300 } = {}) {
    if (!moreloginId) throw new Error("moreloginId required");

    const getStatus = async () => {
      const info = await this.client.getDeviceInfo(moreloginId);
      return { status: info.data?.envStatus, proxyStatus: info.data?.proxyStatus, info: info.data };
    };

    let { status, proxyStatus } = await getStatus();
    logger.info(`[ML START] ${moreloginId} current envStatus=${status} proxyStatus=${proxyStatus}`);

    if (status === 4) {
      logger.info(`[ML START] ${moreloginId} already ready`);
      return { success: true, status };
    }

    // Bind proxy if we have one and current is not good
    if (proxyId) {
      const currentProxy = (await this.client.getDeviceInfo(moreloginId)).data?.proxyId;
      if (!currentProxy) {
        logger.info(`[ML START] Binding proxy ${proxyId}`);
        try {
          // setProxy can take id for pre-created proxy, or full object
          await this.client.setProxy(moreloginId, { proxyProvider: 2 /*socks*/, proxyId });
        } catch (e) {
          logger.warn("setProxy warning (may be ok if passing at powerOn)", e.message);
        }
      }
      logger.info(`[ML START] powerOn with proxyId=${proxyId}`);
      await this.client.powerOn(moreloginId, { proxyId });
    } else {
      logger.info(`[ML START] powerOn (no proxyId)`);
      await this.client.powerOn(moreloginId);
    }

    // Robust poll with retry on transient errors (network, slow start)
    const start = Date.now();
    let lastStatus = status;
    let retries = 0;
    while (Date.now() - start < maxWaitSec * 1000) {
      try {
        const s = await getStatus();
        status = s.status;
        if (status !== lastStatus) {
          logger.info(`[ML START] ${moreloginId} envStatus -> ${status}`);
          lastStatus = status;
        }
        if (status === 4) {
          return { success: true, status };
        }
        if ([1, 5].includes(status)) { // bad states
          throw new Error(`Device ${moreloginId} in bad state envStatus=${status}`);
        }
        retries = 0;
      } catch (e) {
        retries++;
        logger.warn(`[ML START] poll error for ${moreloginId} (retry ${retries}): ${e.message}`);
        if (retries > 5) throw e;
      }
      await new Promise(r => setTimeout(r, 5000));
    }
    throw new Error(`[ML START] Timeout for ${moreloginId} last envStatus=${status}`);
  }

  async createAndPowerPhone({ phone, skuId, proxy, envRemark, metadata = {} } = {}) {
    const payload = {
      skuId: skuId || process.env.MORELOGIN_DEFAULT_SKU_ID || '10004',
      quantity: 1,
      envRemark: envRemark || `wa-control-${phone || 'reg'}-${Date.now()}`,
    };
    const pId = proxy && proxy.id ? proxy.id : null;
    if (pId) payload.proxyId = pId;

    const created = await this.client.createPhone(payload);
    const mlId = Array.isArray(created.data) ? created.data[0] : created.data;
    if (!mlId) throw new Error('Failed to obtain morelogin id from create response');

    const emulator = await this.getOrCreateEmulatorRecord({
      phone,
      moreloginId: mlId,
      metadata: { ...metadata, skuId: payload.skuId, createResponse: created.data },
    });

    await this.updateEmulator(emulator.id, {
      morelogin_id: mlId,
      status: 'starting',
      metadata: { ...emulator.metadata, morelogin_create: created.data },
    });

    // Use reliable starter - pass proxyId if available for consistency
    await this.ensureStarted(mlId, { proxyId: proxy?.id || payload.proxyId || null });

    await this.updateEmulator(emulator.id, {
      status: 'running',
      last_started_at: db.fn.now(),
      metadata: { ...emulator.metadata, powered_on_at: new Date().toISOString(), envStatus: 4 },
    });

    logger.info('MoreLogin cloud phone powered and ready', { emulatorId: emulator.id, moreloginId: mlId });
    return { emulator, moreloginId: mlId };
  }

  async installWhatsApp(moreloginId, { packageName = 'com.whatsapp', versionCode } = {}) {
    let vc = versionCode;
    if (!vc) {
      const wa = await this.client.findWhatsAppApp();
      if (!wa?.versionCode) throw new Error('Could not discover WhatsApp versionCode in MoreLogin catalog');
      vc = wa.versionCode;
      packageName = wa.packageName;
    }

    const res = await this.client.installApp(moreloginId, packageName, vc);
    logger.info('WhatsApp install initiated', { moreloginId, packageName, versionCode: vc, resCode: res.code });

    // Optional: wait a bit and verify installed
    await new Promise(r => setTimeout(r, 8000));
    const installed = await this.client.listInstalledApps(moreloginId).catch(() => []);
    const hasWa = installed.some(a => (a.packageName || a.package_name) === packageName);

    await this.updateByMoreloginId(moreloginId, {
      status: hasWa ? 'installed' : 'running',
      metadata: {
        ...(await this.getEmulator(moreloginId))?.metadata,
        whatsapp: { packageName, versionCode: vc, installed: hasWa, installResult: res },
      },
    });

    return { success: true, packageName, versionCode: vc, installed: hasWa };
  }

  async launchWhatsApp(moreloginId) {
    const pkg = 'com.whatsapp';
    await this.client.startApp(moreloginId, pkg);
    await new Promise(r => setTimeout(r, 4000));
    return { success: true };
  }

  /**
   * FAST PATH: Get (or prepare) a ready cloud phone as quickly as possible.
   * Prefers warm/reusable phones + newMachine over full create.
   * Goal: be ready to enter number in < 90-120s when possible.
   */
  async getFastReadyPhone({ phone, forceNew = false } = {}) {
    // Simple reuse: find a powered-on phone that isn't currently assigned to an active registration
    if (!forceNew) {
      const ready = await db('cloud_emulators')
        .where({ provider: 'morelogin', status: 'running' })
        .whereNotNull('morelogin_id')
        .orderBy('last_started_at', 'desc')
        .first();

      if (ready && ready.morelogin_id) {
        try {
          const info = await this.client.getDeviceInfo(ready.morelogin_id);
          if (info?.data?.envStatus === 4) {
            // Quick reset for clean WA state
            await this.client.newMachine(ready.morelogin_id).catch(() => {});
            await this.client.clearAppData(ready.morelogin_id).catch(() => {});
            await this.updateEmulator(ready.id, {
              status: 'running',
              metadata: { ...ready.metadata, reused: true, fast_ready: true, for_phone: phone }
            });
            logger.info('[FAST] Reusing warm MoreLogin phone', { mlId: ready.morelogin_id, emuId: ready.id });
            return { emulator: ready, moreloginId: ready.morelogin_id, reused: true };
          }
        } catch (e) { /* fall through to create */ }
      }
    }

    // Fallback: create + power (still needed for first time or no warm pool)
    return this.createAndPowerPhone({ phone, metadata: { fast_path: true } });
  }

  /**
   * FAST: Enter the phone number into WhatsApp and stop at "waiting for code" screen.
   * Goal: < 60-90s from having a ready device to "enter code" prompt.
   */
  async enterPhoneNumberFast(moreloginId, phone) {
    const clean = phone.replace(/^\+/, '');      // 18103831775
    const local = clean.replace(/^1/, '');       // 8103831775 (US)

    logger.info('[FAST] Entering phone number on ML device', { moreloginId, phone });

    // Fresh state
    await this.client.clearAppData(moreloginId, 'com.whatsapp').catch(() => {});
    await this.client.forceStopApp(moreloginId).catch(() => {});

    // Launch registration flow
    await this.client.launchWhatsAppForRegistration(moreloginId);
    await new Promise(r => setTimeout(r, 3500));

    // 1. Agree & continue - aggressive tapping + enter key
    for (let i = 0; i < 3; i++) {
      await this.client.touchClick(moreloginId, 540, 1620).catch(() => {});
      await this.client.exeCommand(moreloginId, 'input keyevent 66').catch(() => {}); // ENTER
      await new Promise(r => setTimeout(r, 900));
    }

    // 2. Focus phone input (common region)
    await this.client.touchClick(moreloginId, 540, 900).catch(() => {});
    await new Promise(r => setTimeout(r, 600));

    // 3. Type number (full + local)
    await this.client.exeCommand(moreloginId, `input text ${clean}`).catch(() => {});
    await new Promise(r => setTimeout(r, 400));
    await this.client.exeCommand(moreloginId, `input text ${local}`).catch(() => {});

    // 4. Next / Confirm / OK
    for (const [x, y] of [[900, 1620], [540, 1550], [700, 1680]]) {
      await this.client.touchClick(moreloginId, x, y).catch(() => {});
      await new Promise(r => setTimeout(r, 700));
    }

    // Give it time to request SMS from the network
    await new Promise(r => setTimeout(r, 4500));

    await this.updateByMoreloginId(moreloginId, {
      status: 'awaiting_code',
      metadata: {
        ...(await this.getEmulator(moreloginId))?.metadata,
        phone_entered: phone,
        entered_at: new Date().toISOString()
      }
    });

    logger.info('[FAST] Number entered - WA should be at code verification screen', { moreloginId, phone });
    return { success: true, atCodeScreen: true };
  }

  // === Registration automation (separate sequence) ===

  /**
   * High-level fast registration.
   * Optimized for the 10-minute supplier window:
   *   - Use warm/reused phones when possible.
   *   - Get to "phone number entered, waiting for SMS code" as fast as possible.
   *
   * Two modes:
   *   1. enterPhoneOnly (default when no code): start WA, enter number, stop at code screen.
   *   2. full (with code): also submit the code.
   *
   * Call this as soon as you have the phone number string.
   */
  async registerNumberOnCloud({ phone, code = null, emulatorId = null, enterPhoneOnly = true } = {}) {
    if (!phone) throw new Error('phone is required');

    let emulator, mlId;

    if (emulatorId) {
      emulator = await this.getEmulator(emulatorId);
      mlId = emulator?.morelogin_id;
    } else {
      // === FAST PATH ===
      const prep = await this.getFastReadyPhone({ phone });
      emulator = prep.emulator;
      mlId = prep.moreloginId;
    }

    if (!mlId) throw new Error('No morelogin_id available');

    await this.updateEmulator(emulator.id, { status: 'installing' });

    // Ensure WhatsApp is there (fast path checks, install only if missing)
    const hasWa = await this.client.isWhatsAppInstalled(mlId).catch(() => false);
    if (!hasWa) {
      await this.installWhatsApp(mlId);
    }

    await this.launchWhatsApp(mlId);

    // === FAST NUMBER ENTRY (the critical time-sensitive part) ===
    await this.enterPhoneNumberFast(mlId, phone);

    if (code) {
      // Submit code if provided
      await new Promise(r => setTimeout(r, 3000));
      await this.client.exeCommand(mlId, `input text ${code}`).catch(() => {});
      await this.client.touchClick(mlId, 540, 1400).catch(() => {});
      await new Promise(r => setTimeout(r, 10000));

      await this.updateByMoreloginId(mlId, {
        status: 'registered',
        metadata: {
          ...(emulator.metadata || {}),
          registration: { phone, codeUsed: code, completedAt: new Date().toISOString() }
        }
      });
    } else {
      // Waiting for code from supplier
      await this.updateByMoreloginId(mlId, {
        status: 'awaiting_code',
        metadata: {
          ...(emulator.metadata || {}),
          registration: { phone, waitingForCodeSince: new Date().toISOString() }
        }
      });
    }

    emulator = await this.getEmulator(emulator.id);
    return {
      emulator,
      moreloginId: mlId,
      status: code ? 'registered' : 'awaiting_code',
      instructions: code
        ? 'Registration should be complete. Proceed to link / warming.'
        : 'Phone number entered on cloud phone. Now poll your supplier for the SMS code and call again with code, or use /action to input it.'
    };
  }

  // === Control surface (exposed to API for interactive reg) ===

  async click(moreloginId, x, y) {
    return this.client.touchClick(moreloginId, x, y);
  }

  async inputText(moreloginId, text) {
    // Best via shell
    return this.client.exeCommand(moreloginId, `input text "${text.replace(/"/g, '\\"')}"`);
  }

  async exec(moreloginId, command) {
    return this.client.exeCommand(moreloginId, command);
  }

  async screenshot(moreloginId) {
    return this.client.screenshotBase64(moreloginId);
  }

  async powerOff(moreloginIdOrEmuId) {
    const emu = await this.getEmulator(moreloginIdOrEmuId);
    const mlId = emu?.morelogin_id || moreloginIdOrEmuId;
    const res = await this.client.powerOff(mlId);
    if (emu) {
      await this.updateEmulator(emu.id, { status: 'stopped', metadata: { ...emu.metadata, powered_off_at: new Date().toISOString() } });
    }
    return res;
  }

  // === Bridge to existing link flow ===

  async linkWithPairingCode(emulatorId) {
    // This reuses the exact same logic as the old service for Baileys companion link.
    // The only difference: primary registration happened on the MoreLogin cloud phone.
    const emulator = await this.getEmulator(emulatorId);
    if (!emulator) throw new Error('Emulator not found');

    let account = null;
    if (emulator.ws_account_id) {
      account = await db('ws_accounts').where({ id: emulator.ws_account_id }).first();
    } else if (emulator.phone) {
      account = await db('ws_accounts').where({ phone: emulator.phone }).first();
      if (!account) {
        const [created] = await db('ws_accounts').insert({
          phone: emulator.phone,
          status: 'primary_registered', // we already did the reg on cloud phone
          acquisition_method: 'phone_assoc',
        }).returning('*');
        account = created;
        await this.updateEmulator(emulator.id, { ws_account_id: account.id });
      }
    }
    if (!account) throw new Error('Could not resolve ws_account');

    // Ensure status allows link
    if (!['primary_registered', 'linked', 'offline', 'error'].includes(account.status)) {
      await db('ws_accounts').where({ id: account.id }).update({ status: 'primary_registered' });
    }

    await this.updateEmulator(emulator.id, { status: 'linking' });

    const code = await sessionManager.requestPairingCode(account.id, account.phone, { forceNew: true });

    await this.updateEmulator(emulator.id, {
      status: 'linked',
      last_linked_at: db.fn.now(),
      metadata: { ...emulator.metadata, pairing_code_used: code },
    });

    return {
      success: true,
      pairingCode: code,
      accountId: account.id,
      instructions: 'Enter the pairing code inside the WhatsApp app that is ALREADY REGISTERED on the MoreLogin cloud phone (Linked Devices → Link a device with phone number). Once linked you can power off the cloud phone.',
    };
  }

  // Convenience full separate sequence helper
  async provisionAndRegister({ phone, code, linkAfter = false } = {}) {
    const reg = await this.registerNumberOnCloud({ phone, code });
    let linkResult = null;
    if (linkAfter) {
      linkResult = await this.linkWithPairingCode(reg.emulator.id);
      // IMPORTANT: power off after link initiated to control cost
      await this.powerOff(reg.moreloginId).catch(() => {});
    }
    return { ...reg, linkResult };
  }
}

export default MoreLoginService;
