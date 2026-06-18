import EmulatorService from '../../cloud/emulator.service.js';
import { getProvider, listProviders } from '../../providers/numbers/index.js';
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
    const { ws_account_id, phone, host, metadata = {} } = req.body;

    if (!ws_account_id && !phone) {
      return res.status(400).json({ error: 'ws_account_id or phone is required' });
    }

    if (ws_account_id) {
      const account = await db('ws_accounts').where({ id: ws_account_id }).first();
      if (!account) return res.status(404).json({ error: 'ws_account not found' });
    }

    // Create the emulator record in transitional mode if only phone is given
    const emulator = await emulatorService.createEmulatorRecord({
      wsAccountId: ws_account_id || null,
      phone: phone || null,
      host: host || 'localhost',
      metadata,
    });

    // Kick off provisioning
    const linkOnly = req.body.linkOnly === true ||
                     req.body.assumeRegistered === true ||
                     (emulator.metadata && emulator.metadata.already_registered);

    try {
      const result = await emulatorService.provisionAndLink(
        ws_account_id ? ws_account_id : { phone },
        {
          host: host || 'localhost',
          metadata,
          phone,
          linkOnly,
          assumeRegistered: linkOnly,
        }
      );

      res.status(201).json({
        data: {
          emulator: result.emulator,
          pairingCode: result.linkResult.pairingCode,
          instructions: result.linkResult.instructions,
          accountId: result.linkResult.accountId,
        },
        message: linkOnly
          ? 'Link-only mode: assuming WhatsApp registration already completed externally. Requesting Baileys pairing code.'
          : (ws_account_id ? 'Waydroid provisioning started.' : 'Phone-first provisioning started (port on success only).'),
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

/**
 * Acquire numbers from a pluggable virtual number provider.
 *
 * Supported providers (see src/providers/numbers/):
 *   - grizzly     → GrizzlySMS
 *   - hero        → HeroSMS (hero-sms.com) — SMS-Activate compatible
 *   - manual      → For numbers you already registered WhatsApp on externally
 *
 * Example for automated providers:
 *   { provider: 'grizzly', country: 12, count?: number, service?: 'wa', maxPrice?: 0.99 }
 *   (maxPrice or max_price: optional USD cap — provider will only return numbers under that price when supported)
 *
 * For manual addition (user already completed WhatsApp registration via their own
 * emulator run with --account <phone> + any provider's SMS code):
 *   { provider: 'manual', phone: '+4477...', notes?: string, externalProvider?: 'grizzly|other', externalOrderId?: string }
 *
 * All acquired numbers start in transitional state (cloud_emulator with phone, no/full ws_account later).
 * Port allocation only happens after successful Baileys linking.
 */
export async function acquireNumbers(req, res, next) {
  try {
    const { provider = 'grizzly', count = 1, ...rest } = req.body;

    // Build provider-specific config. Each provider falls back to its own env var inside its constructor.
    const providerConfig = {};
    if (provider === 'grizzly') {
      providerConfig.apiKey = process.env.GRIZZLY_API_KEY;
    } else if (provider === 'hero') {
      providerConfig.apiKey = process.env.HERO_SMS_API_KEY;
    }
    // manual provider doesn't need a key

    const prov = getProvider(provider, providerConfig);

    // Note for new providers like "hero":
    // Make sure the corresponding ENV var is set (e.g. HERO_SMS_API_KEY).
    // The provider constructor will use it via fallback if not passed in config.

    const results = [];
    const max = Math.min(Number(count) || 1, 20);
    let balanceInfo = null;

    // Pre-check balance for providers that support it (to inform about deficit early)
    // This lets us warn the user before they attempt to buy numbers.
    if (typeof prov.getBalance === 'function') {
      try {
        balanceInfo = await prov.getBalance();
      } catch (e) {
        logger.warn('Could not fetch balance before acquire', { error: e.message });
      }
    }

    // For manual provider, balance check is not relevant
    if (provider === 'manual') {
      balanceInfo = { balance: 'N/A (manual entry)', note: 'Manual numbers do not consume provider balance.' };
    }

    for (let i = 0; i < max; i++) {
      try {
        let acquired;

        if (provider === 'manual') {
          acquired = await prov.acquireNumber(rest);
        } else {
          const { country, service = 'wa', maxPrice, max_price } = rest;
          if (!country && provider !== 'manual') {
            throw new Error('country is required for this provider');
          }
          const priceFilter = maxPrice ?? max_price ?? undefined;
          acquired = await prov.acquireNumber({ country, service, maxPrice: priceFilter });
        }

        const emulator = await emulatorService.createEmulatorRecord({
          phone: acquired.phone,
          metadata: {
            provider: acquired.provider || provider,
            order_id: acquired.orderId,
            country: acquired.country,
            service: acquired.service,
            external_provider: acquired.externalProvider,
            external_order_id: acquired.externalOrderId,
            notes: acquired.notes,
            already_registered: !!acquired.alreadyRegistered,
            acquired_at: new Date().toISOString(),
            source: provider,
          },
        });

        results.push({
          phone: acquired.phone,
          orderId: acquired.orderId,
          emulatorId: emulator.id,
          status: emulator.status,
          alreadyRegistered: !!acquired.alreadyRegistered,
        });
      } catch (e) {
        logger.warn(`Failed to acquire number via ${provider}`, { error: e.message });

        // Enrich with current balance on likely deficit errors
        let errorMsg = e.message;
        if (e.message.toUpperCase().includes('BALANCE') || e.message.toUpperCase().includes('NO_BALANCE') || e.message.includes('NO_MONEY')) {
          if (balanceInfo) {
            errorMsg = `${e.message} (Current balance: ${JSON.stringify(balanceInfo)})`;
          } else {
            try {
              const freshBal = await prov.getBalance();
              errorMsg = `${e.message} (Current balance: ${JSON.stringify(freshBal)})`;
            } catch (_) {}
          }
        }

        results.push({ error: errorMsg, provider });
        break; // stop on first balance or serious error to avoid wasting attempts
      }
    }

    const successCount = results.filter(r => r.phone).length;
    const finalBalance = balanceInfo;

    res.status(201).json({
      data: results,
      availableProviders: listProviders(),
      balance: finalBalance,
      message: `${successCount} number(s) acquired via ${provider}. ` +
               (provider === 'manual'
                 ? 'These are marked as already WhatsApp-registered. You can now provision/link them.'
                 : 'Transitional records created. Complete WhatsApp registration in the emulator, then provision.'),
    });
  } catch (e) { next(e); }
}

// Keep old route name working for backward compatibility (maps to general acquire)
export async function acquireGrizzlyNumbers(req, res, next) {
  req.body.provider = 'grizzly';
  return acquireNumbers(req, res, next);
}

/**
 * List transitional / acquired numbers (cloud emulators).
 */
export async function listAcquiredNumbers(req, res, next) {
  try {
    const { only_transitional, provider } = req.query;
    let q = db('cloud_emulators')
      .select('*')
      .orderBy('created_at', 'desc')
      .limit(100);

    if (only_transitional === 'true') {
      q = q.whereNull('ws_account_id');
    }
    if (provider) {
      q = q.whereRaw("metadata->>'source' = ?", [provider]);
    }
    const list = await q;
    res.json({ data: list, availableProviders: listProviders() });
  } catch (e) { next(e); }
}

/**
 * Mark that the user has successfully completed WhatsApp registration for this number
 * (they entered the SMS code from whatever provider they used, inside their emulator
 * that was launched with --account <phone> or equivalent).
 *
 * This moves the record from "acquired" to "registered" so the system knows it is
 * safe to proceed to Baileys pairing / linking without trying to re-do registration.
 */
export async function markNumberRegistered(req, res, next) {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const emulator = await emulatorService.getEmulator(id);
    if (!emulator) return res.status(404).json({ error: 'Emulator / number record not found' });

    if (!emulator.phone) {
      return res.status(400).json({ error: 'This record has no phone' });
    }

    const updated = await emulatorService.updateEmulator(id, {
      status: 'registered',
      metadata: {
        ...emulator.metadata,
        registration_confirmed_at: new Date().toISOString(),
        registration_notes: notes || 'Manually confirmed by operator (WhatsApp SMS code entered in emulator)',
      },
    });

    res.json({
      data: updated,
      message: `Number ${emulator.phone} marked as registered. You can now run provision/link (port will be allocated only after successful Baileys connection).`,
    });
  } catch (e) { next(e); }
}

/** Get balance for the default Grizzly provider (or specified) */
export async function getProviderBalance(req, res, next) {
  try {
    const providerName = req.query.provider || 'grizzly';
    const prov = getProvider(providerName);
    const bal = await prov.getBalance();
    res.json({ data: bal, provider: providerName });
  } catch (e) { next(e); }
}

/** Poll status for a specific acquired order (uses order_id from metadata) */
export async function getOrderStatus(req, res, next) {
  try {
    const { id } = req.params; // emulator id
    const emulator = await emulatorService.getEmulator(id);
    if (!emulator || !emulator.phone) return res.status(404).json({ error: 'Record not found' });

    const orderId = emulator.metadata?.order_id || emulator.metadata?.grizzly_order_id;
    if (!orderId) return res.json({ data: { raw: 'No order_id stored' } });

    const providerName = emulator.metadata?.source || emulator.metadata?.provider || 'grizzly';
    const prov = getProvider(providerName);
    const status = await prov.getSmsCode(orderId);

    // If we got a code, we can surface it and optionally auto-update status
    if (status && status.code) {
      await emulatorService.updateEmulator(id, {
        metadata: {
          ...emulator.metadata,
          last_sms_code: status.code,
          last_status_poll: new Date().toISOString(),
        },
      });
    }

    res.json({ data: { ...status, emulator_id: id, phone: emulator.phone } });
  } catch (e) { next(e); }
}

/** Release / cancel a number (setStatus 8 for most providers like Grizzly) */
export async function releaseNumber(req, res, next) {
  try {
    const { id } = req.params;
    const emulator = await emulatorService.getEmulator(id);
    if (!emulator) return res.status(404).json({ error: 'Record not found' });

    const orderId = emulator.metadata?.order_id || emulator.metadata?.grizzly_order_id;
    if (!orderId) return res.status(400).json({ error: 'No order_id to release' });

    const providerName = emulator.metadata?.source || emulator.metadata?.provider || 'grizzly';
    const prov = getProvider(providerName);
    await prov.setStatus(orderId, 8); // 8 = cancel/release in common SMS-Activate style APIs

    const updated = await emulatorService.updateEmulator(id, {
      status: 'released',
      metadata: {
        ...emulator.metadata,
        released_at: new Date().toISOString(),
      },
    });

    res.json({ data: updated, message: `Released order ${orderId} for ${emulator.phone}` });
  } catch (e) { next(e); }
}
