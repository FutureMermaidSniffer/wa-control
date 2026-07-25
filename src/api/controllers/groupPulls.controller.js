import groupPullsData from '../../data/groupPulls.data.js';
import wsAccountsData from '../../data/wsAccounts.data.js';
import { getSessionManager } from './sessions.controller.js';
import { scheduleGroupPullJob } from '../../jobs/queues.js';
import { logger } from '../../utils/logger.js';
import { normalizeWaPhone } from '../../utils/phone.js';

/**
 * Group Pulls controller — TASKS.md 7.1
 * Uses privileged "admin" WS numbers (scanned/owned with rights) to create groups + add members.
 */

/**
 * Parse target field: either a pure integer (count only) or phone list (comma/newline).
 * @returns {{ target_count: number, target_contacts: string[]|null, invalid: string[] }}
 */
export function parseGroupTargets(raw, bodyCount) {
  const invalid = [];
  let target_contacts = null;
  let target_count = parseInt(bodyCount, 10) || 0;

  if (raw == null || raw === '') {
    return { target_count, target_contacts, invalid };
  }

  // Body may already be an array
  if (Array.isArray(raw)) {
    const phones = [];
    for (const item of raw) {
      const digits = normalizeWaPhone(item, { requireCountry: false, throwOnInvalid: false });
      if (digits && digits.length >= 10 && digits.length <= 15) phones.push(digits);
      else if (String(item || '').trim()) invalid.push(String(item));
    }
    target_contacts = phones.length ? phones : null;
    if (phones.length) target_count = phones.length;
    return { target_count, target_contacts, invalid };
  }

  const s = String(raw).trim();
  // Pure small integer = count only (not a phone)
  if (/^\d{1,4}$/.test(s) && s.length < 10) {
    return { target_count: parseInt(s, 10), target_contacts: null, invalid };
  }

  const tokens = s.split(/[\s,;]+/).map((t) => t.trim()).filter(Boolean);
  const phones = [];
  for (const t of tokens) {
    const digits = normalizeWaPhone(t, { requireCountry: false, throwOnInvalid: false });
    if (digits && digits.length >= 10 && digits.length <= 15) phones.push(digits);
    else invalid.push(t);
  }
  target_contacts = phones.length ? phones : null;
  if (phones.length) target_count = phones.length;
  return { target_count, target_contacts, invalid };
}

export async function listGroupPulls(req, res, next) {
  try {
    const pulls = await groupPullsData.listGroupPulls(req.query);
    res.json({ data: pulls });
  } catch (e) { next(e); }
}

export async function getGroupPull(req, res, next) {
  try {
    const pull = await groupPullsData.getGroupPull(req.params.id);
    if (!pull) return res.status(404).json({ error: 'Group pull not found' });
    res.json({ data: pull });
  } catch (e) { next(e); }
}

export async function createGroupPullTask(req, res, next) {
  try {
    const { subject, admin_ws_account_id, notes } = req.body;
    if (!subject || !admin_ws_account_id) {
      return res.status(400).json({ error: 'subject and admin_ws_account_id required' });
    }

    const admin = await wsAccountsData.findById(admin_ws_account_id);
    if (!admin) return res.status(404).json({ error: 'Admin WS account not found' });

    const rawTargets = req.body.target_contacts ?? req.body.targets ?? null;
    const { target_count, target_contacts, invalid } = parseGroupTargets(
      rawTargets,
      req.body.target_count
    );

    if (invalid.length && !target_contacts?.length && !target_count) {
      return res.status(400).json({
        error: 'No valid target phones. Use full international numbers (e.g. 254712345678) or a small count like 50.',
        invalid,
      });
    }

    const pull = await groupPullsData.createGroupPull({
      subject: String(subject).trim(),
      admin_ws_account_id,
      target_count,
      target_contacts,
      notes: notes || (invalid.length ? `Skipped invalid: ${invalid.join(', ')}` : null),
      created_by: req.user?.id,
      status: 'pending',
    });

    res.status(201).json({
      data: pull,
      invalid: invalid.length ? invalid : undefined,
      note: invalid.length
        ? `Created with ${target_contacts?.length || 0} valid phone(s); skipped ${invalid.length} invalid token(s)`
        : undefined,
    });
  } catch (e) { next(e); }
}

/**
 * Execute the pull:
 * 1. Ensure admin session is live.
 * 2. Create the group (subject).
 * 3. Fetch invite code + link.
 * 4. If target phones/contacts provided, attempt to add a first batch.
 * 5. Update status + persist invite/groupJid.
 */
export async function executeGroupPull(req, res, next) {
  try {
    const { id } = req.params;
    const pull = await groupPullsData.getGroupPull(id);
    if (!pull) return res.status(404).json({ error: 'Not found' });
    if (['completed', 'adding', 'qr_ready'].includes(pull.status)) {
      return res.status(400).json({ error: 'Pull already executed or in progress' });
    }

    const mgr = getSessionManager();

    try {
      await mgr.connectAccount(pull.admin_ws_account_id);
    } catch (e) {
      logger.warn('Group pull: ensure session failed', { id, error: e.message });
    }

    let groupJid;
    try {
      const initial = [];
      if (Array.isArray(pull.target_contacts) && pull.target_contacts.length) {
        initial.push(...pull.target_contacts.slice(0, 3));
      }
      const created = await mgr.createGroup(pull.admin_ws_account_id, pull.subject, initial);
      groupJid = created.id || created.groupId || created;
      await groupPullsData.setGroupCreated(id, groupJid, initial.length);
    } catch (e) {
      await groupPullsData.markFailed(id, `createGroup: ${e.message}`);
      return res.status(500).json({ error: 'Failed to create group', detail: e.message });
    }

    let invite;
    try {
      invite = await mgr.getGroupInviteCode(pull.admin_ws_account_id, groupJid);
      await groupPullsData.setInvite(id, { invite_code: invite.code, invite_link: invite.link });
    } catch (e) {
      logger.warn('Group pull: invite code fetch failed (group may still be usable)', { id, groupJid, error: e.message });
    }

    const targets = [];
    if (Array.isArray(pull.target_contacts)) targets.push(...pull.target_contacts);

    if (targets.length > 0) {
      await scheduleGroupPullJob(id, 1500);
      await groupPullsData.updateGroupPull(id, { status: 'adding' });
    } else {
      await groupPullsData.updateGroupPull(id, { status: 'qr_ready' });
    }

    const updated = await groupPullsData.getGroupPull(id);
    res.json({
      data: updated,
      groupJid,
      invite: invite || null,
    });
  } catch (e) { next(e); }
}

/**
 * Manually add more members to an existing pull's group (supervisor triggered).
 */
export async function addMembersToPull(req, res, next) {
  try {
    const { id } = req.params;
    const pull = await groupPullsData.getGroupPull(id);
    if (!pull) return res.status(404).json({ error: 'Not found' });
    if (!pull.created_group_jid) {
      return res.status(400).json({ error: 'Group not created yet — execute the pull first' });
    }

    const { phones = [] } = req.body;
    const { target_contacts, invalid } = parseGroupTargets(phones, 0);
    if (!target_contacts?.length) {
      return res.status(400).json({
        error: 'No valid phones to add. Use full international numbers (e.g. 254712345678).',
        invalid,
      });
    }

    const mgr = getSessionManager();
    const result = await mgr.addParticipantsToGroup(
      pull.admin_ws_account_id,
      pull.created_group_jid,
      target_contacts
    );
    await groupPullsData.incrementAdded(id, target_contacts.length);
    res.json({ success: true, result, added: target_contacts.length, invalid });
  } catch (e) { next(e); }
}

export async function updateGroupPullStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ['pending', 'qr_ready', 'adding', 'completed', 'failed'];
    if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });
    const updated = await groupPullsData.updateGroupPull(id, { status });
    res.json({ data: updated });
  } catch (e) { next(e); }
}
