/**
 * Delivery status for outbound honesty + peer JID cache for instant correct sends.
 *
 * delivery_status: pending | queued | server_ack | delivered | read | failed
 * peer_remote_jid / peer_phone_jid: last known WA addressing from inbound (LID + PN)
 */
export async function up(knex) {
  const hasDelivery = await knex.schema.hasColumn('messages', 'delivery_status');
  if (!hasDelivery) {
    await knex.schema.alterTable('messages', (t) => {
      t.string('delivery_status', 32).defaultTo(null);
      t.string('fail_reason', 512).defaultTo(null);
      t.integer('wa_status').defaultTo(null); // Baileys WAMessageStatus numeric
    });
  }

  // Remove historical duplicates (desk insert + fromMe upsert) so unique index can be added
  await knex.raw(`
    DELETE FROM messages m
    USING messages d
    WHERE m.wa_message_id IS NOT NULL
      AND m.ws_account_id = d.ws_account_id
      AND m.wa_message_id = d.wa_message_id
      AND m.ctid < d.ctid
  `);

  await knex.raw(`
    CREATE UNIQUE INDEX IF NOT EXISTS messages_ws_account_wa_message_id_uidx
    ON messages (ws_account_id, wa_message_id)
    WHERE wa_message_id IS NOT NULL
  `);

  const hasPeer = await knex.schema.hasColumn('conversations', 'peer_remote_jid');
  if (!hasPeer) {
    await knex.schema.alterTable('conversations', (t) => {
      t.string('peer_remote_jid', 128).defaultTo(null); // often @lid
      t.string('peer_phone_jid', 64).defaultTo(null);   // @s.whatsapp.net
      t.timestamp('peer_jid_updated_at').defaultTo(null);
    });
  }

  await knex.raw(`
    CREATE INDEX IF NOT EXISTS conversations_peer_remote_jid_idx
    ON conversations (ws_account_id, peer_remote_jid)
    WHERE peer_remote_jid IS NOT NULL
  `);
}

export async function down(knex) {
  await knex.raw('DROP INDEX IF EXISTS messages_ws_account_wa_message_id_uidx');
  await knex.raw('DROP INDEX IF EXISTS conversations_peer_remote_jid_idx');

  if (await knex.schema.hasColumn('messages', 'delivery_status')) {
    await knex.schema.alterTable('messages', (t) => {
      t.dropColumn('delivery_status');
      t.dropColumn('fail_reason');
      t.dropColumn('wa_status');
    });
  }

  if (await knex.schema.hasColumn('conversations', 'peer_remote_jid')) {
    await knex.schema.alterTable('conversations', (t) => {
      t.dropColumn('peer_remote_jid');
      t.dropColumn('peer_phone_jid');
      t.dropColumn('peer_jid_updated_at');
    });
  }
}
