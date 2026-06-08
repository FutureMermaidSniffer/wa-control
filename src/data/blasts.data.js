import db from '../db/connection.js';

export async function createCampaign(data) {
  const [campaign] = await db('blast_campaigns')
    .insert({
      type: data.type,
      name: data.name,
      created_by: data.created_by,
      status: data.status || 'draft',
      target_filter: data.target_filter || {},
      message_template: data.message_template,
      scheduled_at: data.scheduled_at,
    })
    .returning('*');
  return campaign;
}

export async function listCampaigns(filters = {}) {
  let q = db('blast_campaigns').select('*').orderBy('created_at', 'desc');
  if (filters.status) q = q.where({ status: filters.status });
  if (filters.type) q = q.where({ type: filters.type });
  return q.limit(filters.limit || 50);
}

export async function getCampaign(id) {
  return db('blast_campaigns').where({ id }).first();
}

export async function updateCampaign(id, patch) {
  const [updated] = await db('blast_campaigns')
    .where({ id })
    .update({ ...patch, updated_at: db.fn.now() })
    .returning('*');
  return updated;
}

export async function createRecipients(campaignId, recipients) {
  if (!recipients.length) return [];
  const rows = recipients.map(r => ({
    campaign_id: campaignId,
    contact_id: r.contact_id || null,
    phone: r.phone,
    ws_account_id: r.ws_account_id,
    status: 'pending',
  }));
  return db('blast_recipients').insert(rows).returning('*');
}

export async function listRecipients(campaignId, filters = {}) {
  let q = db('blast_recipients').where({ campaign_id: campaignId });
  if (filters.status) q = q.where({ status: filters.status });
  return q.orderBy('created_at').limit(100);
}

export async function updateRecipient(id, patch) {
  return db('blast_recipients').where({ id }).update({ ...patch, updated_at: db.fn.now() });
}

export async function countRecipientsByStatus(campaignId) {
  const rows = await db('blast_recipients')
    .where({ campaign_id: campaignId })
    .select('status')
    .count('* as count')
    .groupBy('status');
  const result = { pending: 0, sent: 0, failed: 0, skipped: 0 };
  rows.forEach(r => { result[r.status] = parseInt(r.count); });
  return result;
}

export async function getCampaignWithStats(id) {
  const campaign = await getCampaign(id);
  if (!campaign) return null;
  const stats = await countRecipientsByStatus(id);
  campaign.stats = stats;
  return campaign;
}

export default {
  createCampaign,
  listCampaigns,
  getCampaign,
  updateCampaign,
  createRecipients,
  listRecipients,
  updateRecipient,
  countRecipientsByStatus,
  getCampaignWithStats,
};