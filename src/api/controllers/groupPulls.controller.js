import groupPullsData from '../../data/groupPulls.data.js';
import wsAccountsData from '../../data/wsAccounts.data.js';
import { getSessionManager } from './sessions.controller.js';
import { scheduleGroupPullJob } from '../../jobs/queues.js';
import { logger } from '../../utils/logger.js';
import db from '../../db/connection.js';

/**
 * Group Pulls controller — TASKS.md 7.1
 * Uses privileged "admin" WS numbers (scanned/owned with rights) to create groups + add members.
 */

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
    const { subject, admin_ws_account_id, target_count = 0, target_contacts = null, notes } = req.body;
    if (!subject || !admin_ws_account_id) {
      return res.status(400).json({ error: 'subject and admin_ws_account_id required' });
    }

    const admin = await wsAccountsData.findById(admin_ws_account_id);
    if (!admin) return res.status(404).json({ error: 'Admin WS account not found' });

    const pull = await groupPullsData.createGroupPull({
      subject,
      admin_ws_account_id,
      target_count: parseInt(target_count) || 0,
      target_contacts,
      notes,
      created_by: req.user?.id,
      status: 'pending',
    });

    res.status(201).json({ data: pull });
  } catch (e) { next(e); }
}

/**
 * Execute the pull:
 * 1. Ensure admin session is live.
 * 2. Create the group (subject).
 * 3. Fetch invite code + link.
 * 4. If target phones/contacts provided, attempt to add a first batch (the admin must have rights).
 * 5. Update status + persist invite/groupJid.
 *
 * For large adds, this can be backgrounded via the groupPullQueue (see worker).
 * For MVP we do the create + invite synchronously and schedule a follow-up job for adds.
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

    // 1. Make sure the admin session is connected (will emit QR if needed — client should poll/listen)
    try {
      await mgr.connectAccount(pull.admin_ws_account_id);
    } catch (e) {
      logger.warn('Group pull: ensure session failed', { id, error: e.message });
    }

    // 2. Create group
    let groupJid;
    try {
      // If target_contacts is array of phones, pass a few as initial members (helps make admin)
      const initial = [];
      if (Array.isArray(pull.target_contacts) && pull.target_contacts.length) {
        initial.push(...pull.target_contacts.slice(0, 3)); // small bootstrap
      } else if (pull.target_count > 0) {
        // no real phones yet — create empty or with self if possible; admin will be added by WA
      }
      const created = await mgr.createGroup(pull.admin_ws_account_id, pull.subject, initial);
      groupJid = created.id || created.groupId || created;
      await groupPullsData.setGroupCreated(id, groupJid, initial.length);
    } catch (e) {
      await groupPullsData.markFailed(id, `createGroup: ${e.message}`);
      return res.status(500).json({ error: 'Failed to create group', detail: e.message });
    }

    // 3. Get invite
    let invite;
    try {
      invite = await mgr.getGroupInviteCode(pull.admin_ws_account_id, groupJid);
      await groupPullsData.setInvite(id, { invite_code: invite.code, invite_link: invite.link });
    } catch (e) {
      logger.warn('Group pull: invite code fetch failed (group may still be usable)', { id, groupJid, error: e.message });
    }

    // 4. If we have explicit targets, schedule background add job (safer + rate friendly)
    const targets = [];
    if (Array.isArray(pull.target_contacts)) targets.push(...pull.target_contacts);
    // Also support a simple target_count by generating placeholder — in real use you provide phones
    // For demo we just note the intended count.

    if (targets.length > 0) {
      await scheduleGroupPullJob(id, 1500); // kick the worker to perform adds
      await groupPullsData.updateGroupPull(id, { status: 'adding' });
    } else {
      // No targets supplied yet — just leave in qr_ready so supervisor can add later or use link
      await groupPullsData.updateGroupPull(id, { status: 'qr_ready' });
    }

    const updated = await groupPullsData.getGroupPull(id);
    res.json({ data: updated, invite: invite || null, groupJid });
  } catch (e) { next(e); }
}

/**
 * Manually add more members to an existing pull's group (supervisor triggered).
 * Useful after the initial execute when more phones become available.
 */
export async function addMembersToPull(req, res, next) {
  try {
    const { id } = req.params;
    const { phones = [] } = req.body;
    if (!phones.length) return res.status(400).json({ error: 'phones array required' });

    const pull = await groupPullsData.getGroupPull(id);
    if (!pull || !pull.created_group_jid) {
      return res.status(400).json({ error: 'Pull has no created group yet. Execute first.' });
    }

    const mgr = getSessionManager();
    const result = await mgr.addParticipantsToGroup(pull.admin_ws_account_id, pull.created_group_jid, phones);
    await groupPullsData.incrementAdded(id, phones.length);

    res.json({ success: true, added: phones.length, result });
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
