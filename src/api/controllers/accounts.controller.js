import db from '../../db/connection.js';
import wsAccountsData from '../../data/wsAccounts.data.js';
import portsData from '../../data/ports.data.js';
import { logger } from '../../utils/logger.js';
import { normalizeWaPhone } from '../../utils/phone.js';
import { getSessionEngine } from '../../core/engine/SessionEngine.js';

/** Strip sensitive auth blob; add reconnect eligibility + live socket flags. */
function enrichAccountForApi(acc, liveSet) {
  if (!acc) return acc;
  const { baileys_auth_state, ...rest } = acc;
  const has_auth = !!baileys_auth_state;
  const session_live = liveSet ? liveSet.has(acc.id) : false;
  return {
    ...rest,
    has_auth,
    session_live,
    // UI hint: prefer reconnect when auth exists and socket is down
    can_reconnect: has_auth && !session_live,
  };
}

export async function listAccounts(req, res, next) {
  try {
    // Soft-heal legacy rows stored with leading + (async, non-blocking for response)
    db('ws_accounts')
      .where('phone', 'like', '+%')
      .select('id', 'phone')
      .limit(50)
      .then(async (rows) => {
        for (const r of rows) {
          try {
            const digits = normalizeWaPhone(r.phone);
            if (digits && digits !== r.phone) {
              await db('ws_accounts').where({ id: r.id }).update({ phone: digits, updated_at: db.fn.now() });
            }
          } catch (_) { /* skip bad */ }
        }
      })
      .catch(() => {});

    const accounts = await wsAccountsData.list(req.query);
    let liveSet = new Set();
    try {
      const engine = getSessionEngine();
      const active = engine.getActiveSessions?.() || [];
      // Prefer isSocketLive when available (open ws only)
      for (const id of active) {
        if (engine.isSocketLive) {
          if (engine.isSocketLive(id)) liveSet.add(id);
        } else {
          liveSet.add(id);
        }
      }
    } catch (_) { /* engine not ready */ }

    res.json({ data: accounts.map((a) => enrichAccountForApi(a, liveSet)) });
  } catch (e) { next(e); }
}

export async function getAccount(req, res, next) {
  try {
    const acc = await wsAccountsData.findById(req.params.id);
    if (!acc) return res.status(404).json({ error: 'Account not found' });
    let liveSet = new Set();
    try {
      const engine = getSessionEngine();
      if (engine.isSocketLive?.(acc.id) || engine.getActiveSessions?.().includes(acc.id)) {
        liveSet.add(acc.id);
      }
    } catch (_) { /* ignore */ }
    res.json({ data: enrichAccountForApi(acc, liveSet) });
  } catch (e) { next(e); }
}

export async function importAccounts(req, res, next) {
  try {
    // Simple import: array of {phone, label?, group?, proxy_id?, port_id?}
    const { accounts = [] } = req.body;
    if (!Array.isArray(accounts) || accounts.length === 0) {
      return res.status(400).json({ error: 'accounts array required' });
    }

    const results = [];
    for (const a of accounts) {
      if (!a.phone) continue;
      let phone;
      try {
        phone = normalizeWaPhone(a.phone); // strips +, spaces, dashes
      } catch (err) {
        results.push({ phone: a.phone, status: 'error', error: err.message });
        continue;
      }
      // Match existing whether stored with or without +
      let existing = await wsAccountsData.findByPhone(phone)
        || await wsAccountsData.findByPhone(`+${phone}`)
        || await wsAccountsData.findByPhone(a.phone);
      if (existing) {
        // Heal legacy +prefix rows to digits-only
        if (existing.phone !== phone) {
          await db('ws_accounts').where({ id: existing.id }).update({ phone, updated_at: db.fn.now() });
        }
        results.push({ phone, status: 'exists', id: existing.id });
        continue;
      }
      const created = await wsAccountsData.createAccount({
        phone,
        display_name: a.label || a.name,
        proxy_id: a.proxy_id || null,
        port_id: a.port_id || null,
        group_id: a.group_id || null,
        acquisition_method: a.acquisition_method || 'org_registered',
        status: 'offline',
      });
      if (a.port_id) await portsData.incrementAssigned(a.port_id, 1);
      results.push({ phone, status: 'created', id: created.id });
    }
    res.status(201).json({ imported: results.length, results });
  } catch (e) { next(e); }
}

export async function updateAccount(req, res, next) {
  try {
    const { id } = req.params;
    const allowed = ['display_name', 'group_id', 'status', 'notes', 'proxy_id', 'port_id', 'auto_warm'];
    const patch = {};
    for (const k of allowed) if (k in req.body) patch[k] = req.body[k];
    await db('ws_accounts').where({ id }).update({ ...patch, updated_at: db.fn.now() });
    const updated = await wsAccountsData.findById(id);
    res.json({ data: updated });
  } catch (e) { next(e); }
}

export async function moveToWarehouse(req, res, next) {
  try {
    const { id } = req.params;
    const acc = await wsAccountsData.findById(id);
    if (!acc) return res.status(404).json({ error: 'Not found' });
    if (acc.port_id) await portsData.decrementAssigned(acc.port_id);
    await db('ws_accounts').where({ id }).update({
      is_in_warehouse: true,
      port_id: null,
      status: 'warehouse',
      updated_at: db.fn.now(),
    });
    res.json({ success: true });
  } catch (e) { next(e); }
}

export async function deleteAccount(req, res, next) {
  try {
    const { id } = req.params;
    const { reason = 'manual' } = req.body;
    const acc = await wsAccountsData.findById(id);
    if (!acc) return res.status(404).json({ error: 'Account not found' });

    // Tear down live Baileys session first
    try {
      const { getSessionEngine } = await import('../../core/engine/SessionEngine.js');
      await getSessionEngine().disconnect(id, { permanent: true }).catch(() => {});
    } catch (_) { /* engine optional during tests */ }

    if (acc.port_id) {
      try { await portsData.decrementAssigned(acc.port_id); } catch (_) {}
    }

    // Cascade dependents that lack ON DELETE CASCADE (contacts FK was causing 500)
    await db.transaction(async (trx) => {
      const convos = await trx('conversations').where({ ws_account_id: id }).select('id');
      const convoIds = convos.map((c) => c.id);
      if (convoIds.length) {
        await trx('messages').whereIn('conversation_id', convoIds).del();
      }
      await trx('messages').where({ ws_account_id: id }).del();
      await trx('conversations').where({ ws_account_id: id }).del();
      await trx('contacts').where({ assigned_ws_account_id: id }).del();
      await trx('warming_tasks').where({ ws_account_id: id }).del();
      await trx('blast_recipients').where({ ws_account_id: id }).del();
      await trx('group_pulls').where({ admin_ws_account_id: id }).update({ admin_ws_account_id: null });
      await trx('cloud_emulators').where({ ws_account_id: id }).update({ ws_account_id: null });
      await trx('diversion_links').where({ target_ws_account_id: id }).update({ target_ws_account_id: null });
      await trx('ws_accounts').where({ id }).del();
      await trx('audit_logs').insert({
        user_id: req.user?.id,
        action: 'ws_account.delete',
        entity_type: 'ws_account',
        entity_id: id,
        details: { reason, phone: acc.phone },
      });
    });

    res.json({ success: true, deleted: id, phone: acc.phone });
  } catch (e) { next(e); }
}
