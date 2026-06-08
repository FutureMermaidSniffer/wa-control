/**
 * Core foundation tables for WA Control (modeled on Rocket WS PDF + proxies + warming + ports)
 * Run with: npm run migrate
 *
 * NOTE: Uses gen_random_uuid() — modern Postgres (13+). For older:
 *   await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');
 */
export async function up(knex) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');
  // Users (supervisor + agents)
  await knex.schema.createTable('users', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.string('email').unique().notNullable();
    t.string('password_hash').notNullable();
    t.string('name').notNullable();
    t.enum('role', ['supervisor', 'agent', 'admin']).notNullable().defaultTo('agent');
    t.boolean('is_active').defaultTo(true);
    t.timestamps(true, true);
  });

  // Permissions (granular like PDF batch, warming control, desk access etc.)
  await knex.schema.createTable('permissions', (t) => {
    t.increments('id').primary();
    t.string('key').unique().notNullable(); // e.g. 'accounts.batch', 'warming.manage', 'desk.chat', 'ports.purchase'
    t.string('group_name');
    t.text('description');
  });

  await knex.schema.createTable('role_permissions', (t) => {
    t.integer('role_id').references('id').inTable('permissions'); // simplistic; in real use string roles + join
    t.integer('permission_id').references('id').inTable('permissions');
    t.primary(['role_id', 'permission_id']);
  });

  // Proxies (per port / per number geo support)
  await knex.schema.createTable('proxies', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.string('name').notNullable();
    t.enum('type', ['http', 'socks5']).notNullable().defaultTo('socks5');
    t.string('host').notNullable();
    t.integer('port').notNullable();
    t.string('username');
    t.string('password_enc'); // encrypted
    t.string('region'); // e.g. 'us-east', 'sg', 'eu'
    t.string('status').defaultTo('active'); // active, degraded, dead
    t.float('success_rate').defaultTo(1.0);
    t.timestamp('last_checked_at');
    t.timestamps(true, true);
  });

  // Ports (the "purchase" / capacity tracking unit from PDF)
  await knex.schema.createTable('ports', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.enum('type', ['normal', 'fast_warm']).notNullable().defaultTo('normal');
    t.timestamp('purchased_at').defaultTo(knex.fn.now());
    t.timestamp('starts_at');
    t.timestamp('expires_at');
    t.string('status').defaultTo('active'); // active, expired, full
    t.integer('internal_cost_cents').defaultTo(0);
    t.text('notes');
    t.integer('max_numbers').defaultTo(1); // usually 1:1
    t.integer('numbers_assigned').defaultTo(0);
    t.timestamps(true, true);
  });

  // Account groups
  await knex.schema.createTable('account_groups', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.string('name').notNullable();
    t.text('description');
    t.timestamps(true, true);
  });

  // Core: WS Numbers / Accounts (linked via Baileys)
  await knex.schema.createTable('ws_accounts', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('port_id').references('id').inTable('ports').onDelete('SET NULL');
    t.uuid('proxy_id').references('id').inTable('proxies').onDelete('SET NULL');
    t.uuid('group_id').references('id').inTable('account_groups').onDelete('SET NULL');

    t.string('phone').notNullable().unique();
    t.string('jid'); // full WhatsApp JID after linking
    t.string('display_name');
    t.string('avatar_url'); // current on WA

    t.enum('status', ['active', 'warming', 'warehouse', 'offline', 'error', 'banned', 'pending_login']).defaultTo('pending_login');
    t.enum('acquisition_method', ['org_registered', 'scan_linked', 'phone_assoc']).defaultTo('scan_linked'); // all "owned" per user instruction

    t.boolean('is_in_warehouse').defaultTo(false);
    t.uuid('current_warming_task_id');

    t.jsonb('baileys_auth_state'); // creds + keys (encrypt sensitive parts in real impl)
    t.timestamp('last_linked_at');
    t.timestamp('last_seen_at');
    t.integer('health_score').defaultTo(100);
    t.integer('daily_sent').defaultTo(0);

    t.timestamps(true, true);
  });

  // Basic indexes for PDF-like search
  await knex.raw('CREATE INDEX idx_ws_accounts_status ON ws_accounts(status)');
  await knex.raw('CREATE INDEX idx_ws_accounts_port ON ws_accounts(port_id)');
  await knex.raw('CREATE INDEX idx_ws_accounts_phone ON ws_accounts(phone)');

  // Materials (avatars, nicks, messages)
  await knex.schema.createTable('materials', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.enum('type', ['avatar', 'nickname', 'message']).notNullable();
    t.string('name');
    t.text('content'); // for text or url for image
    t.string('mime_type');
    t.integer('usage_count').defaultTo(0);
    t.uuid('created_by');
    t.timestamps(true, true);
  });

  // Basic contacts / fans (expand heavily later)
  await knex.schema.createTable('contacts', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.string('phone').notNullable();
    t.string('name');
    t.jsonb('tags').defaultTo('[]');
    t.string('source');
    t.boolean('opted_in').defaultTo(true);
    t.boolean('dnd').defaultTo(false);
    t.uuid('assigned_ws_account_id').references('id').inTable('ws_accounts');
    t.timestamps(true, true);
    t.unique(['phone', 'assigned_ws_account_id']); // simplistic; relax as needed
  });

  // Audit (every important action)
  await knex.schema.createTable('audit_logs', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('user_id');
    t.string('action').notNullable(); // e.g. 'ws_account.login', 'port.purchase', 'blast.start', 'warm.enter'
    t.string('entity_type');
    t.uuid('entity_id');
    t.jsonb('details');
    t.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // Refresh tokens etc for auth (add in next migration if needed)
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('audit_logs');
  await knex.schema.dropTableIfExists('contacts');
  await knex.schema.dropTableIfExists('materials');
  await knex.schema.dropTableIfExists('ws_accounts');
  await knex.schema.dropTableIfExists('account_groups');
  await knex.schema.dropTableIfExists('ports');
  await knex.schema.dropTableIfExists('proxies');
  await knex.schema.dropTableIfExists('role_permissions');
  await knex.schema.dropTableIfExists('permissions');
  await knex.schema.dropTableIfExists('users');
}
