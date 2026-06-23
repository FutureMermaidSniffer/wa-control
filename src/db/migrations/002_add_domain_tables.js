/**
 * Additional core domain tables per TASKS.md Phase 1.1 (warming, blasts, diversion, convos, groups, exports, etc.)
 * + fixes for role_permissions (use string roles since users.role is enum)
 */
export async function up(knex) {
  // Fix role_permissions: drop simplistic and recreate with string role + permission key ref
  await knex.schema.dropTableIfExists('role_permissions');
  await knex.schema.createTable('role_permissions', (t) => {
    t.string('role').notNullable(); // 'supervisor' | 'agent' | ...
    t.integer('permission_id').references('id').inTable('permissions').onDelete('CASCADE');
    t.primary(['role', 'permission_id']);
  });

  // Warming pools
  await knex.schema.createTable('warming_pools', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.string('name').notNullable().defaultTo('Default Warm Pool');
    t.text('description');
    t.enum('mode', ['normal', 'fast_warm']).defaultTo('normal');
    t.integer('target_days').defaultTo(10);
    t.timestamps(true, true);
  });

  // Warming tasks
  await knex.schema.createTable('warming_tasks', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('ws_account_id').references('id').inTable('ws_accounts').onDelete('CASCADE').notNullable();
    t.uuid('warming_pool_id').references('id').inTable('warming_pools');
    t.enum('status', ['pending', 'executing', 'paused', 'completed', 'failed']).defaultTo('pending');
    t.enum('mode', ['normal', 'fast_warm']).defaultTo('normal');
    t.integer('progress_days').defaultTo(0);
    t.integer('target_days').defaultTo(10);
    t.timestamp('started_at');
    t.timestamp('completed_at');
    t.jsonb('schedule_config'); // intensity, times etc.
    t.text('notes');
    t.timestamps(true, true);
  });

  // Update ws_accounts to reference warming task properly (if not already FK)
  // Note: current ws_accounts has current_warming_task_id as uuid without FK; add FK
  try {
    await knex.raw(`
      ALTER TABLE ws_accounts 
      ADD CONSTRAINT fk_warming_task 
      FOREIGN KEY (current_warming_task_id) REFERENCES warming_tasks(id) ON DELETE SET NULL
    `);
  } catch (e) {
    // may already exist or column not ready; ignore for idempotency in dev
  }

  // Diversion links
  await knex.schema.createTable('diversion_links', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('target_ws_account_id').references('id').inTable('ws_accounts').onDelete('SET NULL');
    t.string('name').notNullable();
    t.string('short_code').unique().notNullable(); // e.g. used in /d/abc123 or full path
    t.string('target_url'); // optional external landing
    t.integer('leads_captured').defaultTo(0);
    t.integer('clicks').defaultTo(0);
    t.boolean('is_active').defaultTo(true);
    t.timestamps(true, true);
  });

  // Blast campaigns
  await knex.schema.createTable('blast_campaigns', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.enum('type', ['fan', 'cold']).notNullable(); // fan blast / cold blast
    t.string('name');
    t.uuid('created_by'); // user id
    t.enum('status', ['draft', 'scheduled', 'running', 'paused', 'completed', 'failed']).defaultTo('draft');
    t.jsonb('target_filter'); // tags, groups, or list of phones for cold
    t.integer('total_targets').defaultTo(0);
    t.integer('sent_count').defaultTo(0);
    t.integer('failed_count').defaultTo(0);
    t.timestamp('scheduled_at');
    t.timestamp('started_at');
    t.timestamp('completed_at');
    t.text('message_template');
    t.jsonb('stats');
    t.timestamps(true, true);
  });

  await knex.schema.createTable('blast_recipients', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('campaign_id').references('id').inTable('blast_campaigns').onDelete('CASCADE').notNullable();
    t.uuid('contact_id');
    t.string('phone').notNullable();
    t.uuid('ws_account_id'); // which number sent it
    t.enum('status', ['pending', 'sent', 'failed', 'skipped']).defaultTo('pending');
    t.text('error');
    t.timestamp('sent_at');
    t.timestamps(true, true);
  });

  // Group pulls
  await knex.schema.createTable('group_pulls', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.string('subject').notNullable();
    t.uuid('admin_ws_account_id').references('id').inTable('ws_accounts'); // the privileged one for add
    t.jsonb('target_contacts'); // or count
    t.integer('target_count');
    t.string('invite_code');
    t.string('invite_link');
    t.enum('status', ['pending', 'qr_ready', 'adding', 'completed', 'failed']).defaultTo('pending');
    t.uuid('created_group_jid');
    t.integer('added_count').defaultTo(0);
    t.uuid('created_by');
    t.timestamps(true, true);
  });

  // Conversations (for desk history + inheritance)
  await knex.schema.createTable('conversations', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('ws_account_id').references('id').inTable('ws_accounts').onDelete('CASCADE');
    t.string('contact_phone').notNullable();
    t.string('contact_name');
    t.timestamp('last_message_at');
    t.integer('unread_count').defaultTo(0);
    t.boolean('pinned').defaultTo(false);
    t.timestamps(true, true);
    t.unique(['ws_account_id', 'contact_phone']);
  });

  await knex.schema.createTable('messages', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('conversation_id').references('id').inTable('conversations').onDelete('CASCADE');
    t.uuid('ws_account_id').references('id').inTable('ws_accounts');
    t.string('direction').notNullable(); // 'in' | 'out'
    t.text('text');
    t.jsonb('media'); // {type, url, ...}
    t.string('wa_message_id'); // from Baileys
    t.timestamp('timestamp');
    t.jsonb('raw'); // optional full payload for debug
    t.timestamps(true, true);
  });

  // Exports registry
  await knex.schema.createTable('exports', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('user_id');
    t.string('type').notNullable(); // 'contacts', 'history', 'blast_unsent', etc.
    t.string('status').defaultTo('pending'); // pending, ready, failed
    t.string('file_path');
    t.string('file_name');
    t.jsonb('filter_params');
    t.integer('row_count');
    t.timestamp('completed_at');
    t.timestamps(true, true);
  });

  // More indexes
  await knex.raw('CREATE INDEX IF NOT EXISTS idx_warming_tasks_status ON warming_tasks(status)');
  await knex.raw('CREATE INDEX IF NOT EXISTS idx_blast_campaigns_status ON blast_campaigns(status)');
  await knex.raw('CREATE INDEX IF NOT EXISTS idx_conversations_account ON conversations(ws_account_id)');
  await knex.raw('CREATE INDEX IF NOT EXISTS idx_messages_convo ON messages(conversation_id)');

  // Add a few more columns to existing if needed (e.g. proxy health in proxies already)
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('exports');
  await knex.schema.dropTableIfExists('messages');
  await knex.schema.dropTableIfExists('conversations');
  await knex.schema.dropTableIfExists('group_pulls');
  await knex.schema.dropTableIfExists('blast_recipients');
  await knex.schema.dropTableIfExists('blast_campaigns');
  await knex.schema.dropTableIfExists('diversion_links');
  await knex.schema.dropTableIfExists('warming_tasks');
  await knex.schema.dropTableIfExists('warming_pools');
  // role_permissions drop not critical
}
