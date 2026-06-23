import blastsData from '../../data/blasts.data.js';
import contactsData from '../../data/contacts.data.js';
import wsAccountsData from '../../data/wsAccounts.data.js';
import db from '../../db/connection.js';
import { scheduleBlastJob } from '../../jobs/queues.js';
import { logger } from '../../utils/logger.js';

export async function listCampaigns(req, res, next) {
  try {
    const campaigns = await blastsData.listCampaigns(req.query);
    // attach basic stats
    for (const c of campaigns) {
      c.stats = await blastsData.countRecipientsByStatus(c.id);
    }
    res.json({ data: campaigns });
  } catch (e) { next(e); }
}

export async function getCampaign(req, res, next) {
  try {
    const campaign = await blastsData.getCampaignWithStats(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    const recipients = await blastsData.listRecipients(req.params.id, { status: req.query.recipient_status });
    res.json({ data: campaign, recipients });
  } catch (e) { next(e); }
}

export async function createFanBlast(req, res, next) {
  try {
    const { name, message_template, target_contact_ids, ws_account_id, scheduled_at } = req.body;
    if (!message_template || !ws_account_id) {
      return res.status(400).json({ error: 'message_template and ws_account_id required' });
    }

    let targets = [];
    if (target_contact_ids && target_contact_ids.length) {
      targets = await contactsData.listContacts({ limit: 1000 });
      targets = targets.filter(c => target_contact_ids.includes(c.id) && !c.dnd && c.opted_in);
    } else {
      // default: all opted-in non-DND contacts for the account
      targets = await contactsData.listContacts({ assigned_ws_account_id: ws_account_id, limit: 1000 });
      targets = targets.filter(c => !c.dnd && c.opted_in);
    }

    if (!targets.length) {
      return res.status(400).json({ error: 'No valid target contacts found' });
    }

    const campaign = await blastsData.createCampaign({
      type: 'fan',
      name: name || 'Fan Blast',
      created_by: req.user?.id,
      status: scheduled_at ? 'scheduled' : 'draft',
      target_filter: { contact_ids: targets.map(t => t.id) },
      message_template,
      scheduled_at,
    });

    const recipients = targets.map(t => ({
      phone: t.phone,
      contact_id: t.id,
      ws_account_id,
    }));

    await blastsData.createRecipients(campaign.id, recipients);

    if (!scheduled_at) {
      // auto start for small fan blast (demo)
      await blastsData.updateCampaign(campaign.id, { status: 'running', started_at: db.fn.now() });
      await scheduleBlastJob(campaign.id);
    } else {
      await scheduleBlastJob(campaign.id, new Date(scheduled_at).getTime() - Date.now());
    }

    res.status(201).json({ data: campaign });
  } catch (e) { next(e); }
}

/**
 * Cold blast: targets are "stranger" / cold phones supplied explicitly (or from a dedicated pool later).
 * No contact opt-in/DND filtering by default (still subject to global/per-number caps in worker).
 * target_phones: array of phone strings.
 */
export async function createColdBlast(req, res, next) {
  try {
    const { name, message_template, target_phones = [], ws_account_id, scheduled_at } = req.body;
    if (!message_template || !ws_account_id) {
      return res.status(400).json({ error: 'message_template and ws_account_id required' });
    }
    if (!Array.isArray(target_phones) || target_phones.length === 0) {
      return res.status(400).json({ error: 'target_phones (array of strings) required for cold blast' });
    }

    // Basic normalization: keep only plausible phones
    const phones = target_phones
      .map(p => String(p).trim())
      .filter(p => p && /[\d+]/.test(p))
      .slice(0, 5000); // safety upper bound for MVP

    if (!phones.length) {
      return res.status(400).json({ error: 'No valid target phones after normalization' });
    }

    const campaign = await blastsData.createCampaign({
      type: 'cold',
      name: name || 'Cold Blast',
      created_by: req.user?.id,
      status: scheduled_at ? 'scheduled' : 'draft',
      target_filter: { phones, source: 'explicit_cold_list' },
      message_template,
      scheduled_at,
    });

    const recipients = phones.map(ph => ({
      phone: ph,
      contact_id: null, // cold = not (yet) in contacts
      ws_account_id,
    }));

    await blastsData.createRecipients(campaign.id, recipients);

    if (!scheduled_at) {
      await blastsData.updateCampaign(campaign.id, { status: 'running', started_at: db.fn.now() });
      await scheduleBlastJob(campaign.id);
    } else {
      await scheduleBlastJob(campaign.id, new Date(scheduled_at).getTime() - Date.now());
    }

    res.status(201).json({ data: campaign, recipient_count: recipients.length });
  } catch (e) { next(e); }
}

export async function updateCampaignStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ['draft', 'scheduled', 'running', 'paused', 'completed', 'failed'];
    if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });

    const patch = { status };
    if (status === 'running') patch.started_at = db.fn.now();
    if (status === 'completed' || status === 'failed') patch.completed_at = db.fn.now();

    const updated = await blastsData.updateCampaign(id, patch);
    res.json({ data: updated });
  } catch (e) { next(e); }
}

export async function exportUnsent(req, res, next) {
  try {
    const recipients = await blastsData.listRecipients(req.params.id, { status: 'pending' });
    // In real impl, generate CSV and register in exports table. For now return JSON.
    res.json({ data: recipients, count: recipients.length });
  } catch (e) { next(e); }
}