import db from '../../db/connection.js';
import wsAccountsData from '../../data/wsAccounts.data.js';
import portsData from '../../data/ports.data.js';
import { logger } from '../../utils/logger.js';

export async function listAccounts(req, res, next) {
  try {
    const accounts = await wsAccountsData.list(req.query);
    res.json({ data: accounts });
  } catch (e) { next(e); }
}

export async function getAccount(req, res, next) {
  try {
    const acc = await wsAccountsData.findById(req.params.id);
    if (!acc) return res.status(404).json({ error: 'Account not found' });
    res.json({ data: acc });
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
      let existing = await wsAccountsData.findByPhone(a.phone);
      if (existing) {
        results.push({ phone: a.phone, status: 'exists', id: existing.id });
        continue;
      }
      const created = await wsAccountsData.createAccount({
        phone: a.phone,
        display_name: a.label || a.name,
        proxy_id: a.proxy_id || null,
        port_id: a.port_id || null,
        group_id: a.group_id || null,
        acquisition_method: a.acquisition_method || 'org_registered',
        status: 'offline',
      });
      if (a.port_id) await portsData.incrementAssigned(a.port_id, 1);
      results.push({ phone: a.phone, status: 'created', id: created.id });
    }
    res.status(201).json({ imported: results.length, results });
  } catch (e) { next(e); }
}

export async function updateAccount(req, res, next) {
  try {
    const { id } = req.params;
    const allowed = ['display_name', 'group_id', 'status', 'notes'];
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
    if (acc?.port_id) await portsData.decrementAssigned(acc.port_id);
    // audit would log here
    await db('ws_accounts').where({ id }).del();
    await db('audit_logs').insert({
      user_id: req.user?.id,
      action: 'ws_account.delete',
      entity_type: 'ws_account',
      entity_id: id,
      details: { reason },
    });
    res.json({ success: true });
  } catch (e) { next(e); }
}
