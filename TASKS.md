# WA Control — Production-Ready Implementation Plan

**Last Updated**: 2026-07-03  
**Status**: Active — MoreLogin-centric, Waydroid fully deprecated  
**Architecture**: MoreLogin Cloud Phones (registration) → Baileys companion sessions (runtime) → warming → CS desk

---

## System Understanding (Read Before Building)

### What the system actually is (from live RE of hf4cs.rocketgo.vip)
We reverse-engineered the real Rocket system. Here is what production looks like:
- **Account layer**: Each "cs account" is a WA number. The CS desk calls it `csUsername`. Proxy is embedded in the account row (`socksHost/Port/Username/Password`).
- **Contact/Fan layer**: `biz/friends/list?csUsername=...` returns contacts for that number. Each contact has `isFans`, `isBlock`, `labels`, `csId`, `chargeId`.
- **Chat**: `chatLogList?csUsername=X&username=Y` returns messages. `chatType` distinguishes text (1), image (2), audio (3), sticker/reaction (`notify` field). `isSend` is direction. Messages have `fileUrl`, `protoBuf`, `messageId`.
- **Materials**: `avatarstore`, `nicknamestore`, `smstore` (quick reply message templates) are separate entities, not one generic `materials` table.
- **Real-time**: Mix of polling (`getNotRead`) and WebSocket. Socket.io is our equivalent.
- **Agent permissions**: Granular (`biz:chat:all`, `biz:send:add`, `biz:friends:edit`, etc.).

### Registration flow (MoreLogin-centric, no Waydroid)
```
Number supplier (Grizzly/Hero/manual)
    → Get phone number + SMS verification code
    → POST /cloud/morelogin/create-for-reg   (creates ML cloud phone, installs WA)
    → POST /cloud/morelogin/register          (enters phone + code via ADB, confirms reg)
    → ws_account.status = 'primary_registered'
    → POST /sessions/connect (usePairingCode: true)
    → 8-digit code → operator enters in ML cloud phone WA → link completes
    → POST /cloud/morelogin/:id/power-off     (ALWAYS — cost control)
    → ws_account.status = 'linked'
    → Auto or manual: enter warming pool
    → Warming runs on Baileys headless session (no cloud phone needed)


### Current Implementation State (2026-07-03)

**DONE:**
- SessionManager (Baileys, DB auth state, proxy injection, pairing code, MACOS UA patch)
- MoreLogin client (all API methods, token refresh, local+open mode)
- MoreLogin service (lifecycle, registration helpers, DB records)
- DB migrations 001-007 (core schema)
- Basic CRUD APIs: accounts, proxies, ports, warming, blasts, materials, contacts, cloud, groups, messages
- Pairing code bug fixed (status=linking now allowed, revival of stuck accounts)
- Warming entry restriction fixed (accepts linked/active/offline/error)
- mark-registered endpoint added
- Auto-warming after link (auto_warm flag on ws_accounts)
- proxy quick-add + bulk-assign endpoints
- Warming worker (BullMQ, basic behavior simulation)
- Blast + group-pull workers (skeleton)
- Socket.io realtime (QR, connected, pairing_code, messages)
- Message persistence (in + out)

**MISSING / BLOCKING PRODUCTION:**
- DB columns: auto_warm, warm_mode, warm_target_days on ws_accounts; contact is_fans, is_block, label_ids; unread tracking on conversations
- Separate materials tables: smstore (quick reply), avatar_library, nickname_library
- Fan labels table
- Export tasks table
- Full MoreLogin onboarding as one trackable API workflow (not manual multi-step)
- ADB registration automation tested end-to-end on real number
- CS desk API (exact Rocket-compatible endpoints from RE)
- Warming: richer behavior simulation, anti-ban pause, warm groups
- Frontend: account list, link modal, warming status, CS chat UI
- Rate limiting, proxy health auto-rotate, auth-state backup

---

## PHASE A — DB Schema Completion + Foundation Gaps
**Priority: IMMEDIATE — nothing else works without this**
**Est: 2 days**

### A.1 — Migration 008: Fill ws_accounts gaps
Create src/db/migrations/008_ws_accounts_warming_flags.js

Add to ws_accounts:
- auto_warm BOOLEAN DEFAULT FALSE
- warm_mode VARCHAR DEFAULT 'normal'  ('normal' | 'fast_warm')
- warm_target_days INTEGER DEFAULT 10
- notes TEXT
- is_block BOOLEAN DEFAULT FALSE
- charge_id UUID

**Test**: npm run migrate succeeds. SessionManager can read auto_warm on connected event.

### A.2 — Migration 009: Fan labels + contacts improvements
Create src/db/migrations/009_fan_labels_contacts.js

New table fan_labels:
- id UUID PRIMARY KEY
- name VARCHAR NOT NULL
- color VARCHAR DEFAULT '#888'
- created_by UUID REFERENCES users(id)

Alter contacts:
- is_fans BOOLEAN DEFAULT FALSE
- is_block BOOLEAN DEFAULT FALSE
- label_ids UUID[]
- charge_id UUID
- cs_username VARCHAR (indexed — which WA number owns this contact)
- source VARCHAR ('inbound' | 'import' | 'diversion' | 'desk_out')
- last_message_at TIMESTAMP

New join table contact_label_map:
- contact_id + label_id composite PK

**Test**: Create label "Hot Lead", assign to 3 contacts, query via join.

### A.3 — Migration 010: Separate materials tables
Create src/db/migrations/010_materials_separate.js

smstore (quick-reply message templates):
- id, name, content, category, usage_count, created_by, timestamps

avatar_library:
- id, name, file_path, file_size, is_active, usage_count, created_by, timestamps

nickname_library:
- id, name (the nickname string), category, usage_count, created_by, timestamps

Keep old materials table for transition (add migration note).

**Test**: Insert 3 avatars, 5 nicknames, 2 smstore templates. Query each.

### A.4 — Migration 011: Conversations + unread tracking
Create src/db/migrations/011_conversations_unread.js

Alter conversations:
- cs_username VARCHAR (indexed)
- unread_count INTEGER DEFAULT 0
- last_message_at TIMESTAMP
- last_message_text TEXT
- is_pinned BOOLEAN DEFAULT FALSE
- is_archived BOOLEAN DEFAULT FALSE
- assigned_agent_id UUID REFERENCES users(id)

Add index on (ws_account_id, updated_at DESC) and (cs_username, contact_phone).

**Test**: Query conversations WHERE cs_username = $1 ORDER BY last_message_at DESC. Fast.

### A.5 — Migration 012: Export tasks + registration tracking
Create src/db/migrations/012_export_tasks.js

export_tasks:
- id, type (contacts/chat_history/blast_unsent/account_list), status, filters JSONB, file_path, row_count, created_by, completed_at, timestamps

registration_logs:
- id, ws_account_id, morelogin_id, phone, provider, step, metadata JSONB, error, timestamps
- step values: 'created' | 'installing_wa' | 'registered' | 'linking' | 'linked' | 'powered_off'

**Test**: Create export_task row, update status to 'done', query by type.

### A.6 — Data access layer for new tables
- src/data/fanLabels.data.js (CRUD for fan_labels)
- src/data/smstore.data.js (CRUD for smstore)
- src/data/avatarLibrary.data.js (CRUD + file path management)
- src/data/nicknameLibrary.data.js (CRUD)
- src/data/exportTasks.data.js (CRUD + status tracking)

Seeds: 3 default fan labels (Hot Lead, Cold, VIP), 5 sample nicknames, 2 smstore templates.

**Test**: npm run seed succeeds. All data layers return typed results.

---

## PHASE B — MoreLogin Onboarding: Full Trackable Flow
**Priority: IMMEDIATE — needed to get numbers linked**
**Est: 3-4 days**

### B.1 — Onboarding orchestrator service
Create src/cloud/onboarding.service.js

Single method onboardNumber({ phone, smsCode, proxy, skuId, warmAfterLink }) that:
1. Creates ws_account (status: pending_verification)
2. Creates MoreLogin cloud phone (createAndPowerPhone)
3. Installs WhatsApp (installWhatsApp)
4. Registers: enters phone + SMS code via ADB (registerNumberOnCloudPhone)
5. Waits for registration confirmation (screenshot poll or timeout)
6. Marks ws_account as primary_registered
7. Requests Baileys pairing code
8. Returns pairing code + waits for link event
9. On link: powers off cloud phone
10. If warmAfterLink: schedules warming task

Each step logs to registration_logs. On failure: saves error + step. Supports resume.

**Test**: Call onboardNumber from test script with real number+code. See registration_logs step entries.

### B.2 — ADB registration automation (reliable)
Improve src/cloud/morelogin.service.js registerNumberOnCloudPhone:

Sequence:
1. am force-stop com.whatsapp + clear data
2. am start WhatsApp registration activity
3. Poll screenshot until phone number entry screen detected (or 30s timeout)
4. input text +countryCode+number via ADB
5. Tap "Next" (known coords for Android 15 + WA version, documented)
6. Wait for SMS code prompt
7. input text code
8. Screenshot verify: "Chats" or "Name" screen confirms success
9. Return { success: true, screenshot: base64 } or { success: false, step, screenshot }

Document coord map per WA version. Fallback to manual (return screenshot + partial status).

**Test gate**: Run on MoreLogin cloud phone with cheap test number. WA starts, number entered, code entered, registration confirmed without manual intervention.

### B.3 — Onboarding API endpoints
Add to cloud.routes.js and cloud.controller.js:

POST /cloud/onboard
  Body: { phone, smsCode, proxyId?, skuId?, warmAfterLink? }
  Returns: { onboardId, phone, step, pairingCode?, status }

GET /cloud/onboard/:onboardId
  Poll current step + status from registration_logs

POST /cloud/onboard/:onboardId/resume
  Resume from last failed step

POST /cloud/onboard/:onboardId/power-off
  Explicit cost-control (always callable)

**Test**: Call POST /cloud/onboard and get pairingCode back without touching other endpoints.

### B.4 — Number acquisition integration (Grizzly/Hero)
Improve src/integrations/grizzlySms.js:
- acquireNumber(country, service='wa') -> { phone, orderId }
- getSmsCode(orderId, { maxWaitSeconds: 180 }) — polls until code arrives
- releaseNumber(orderId) — cancel on registration failure

Expose:
POST /cloud/acquire-and-onboard
  Body: { country: 'US', proxyId?, warmAfterLink?, skuId? }
  Returns: { phone, pairingCode, onboardId }

**Test**: One API call acquires number + registers + returns pairing code.

### B.5 — MoreLogin proxy binding
The proxy 148.113.193.96:5959 must be set on the cloud phone during WA registration.

In src/cloud/morelogin.service.js add:
```
async setHttpProxyOnPhone(moreloginId, { host, port, username, password }) {
  return this.client.setProxy(moreloginId, {
    proxyProvider: 0,  // 0=http, 1=https, 2=socks5
    proxyIp: host,
    proxyPort: port,
    username: username || '',
    password: password || '',
  });
}
```

Call before powerOn so WA registration originates from our proxy IP.
Same proxy UUID used for Baileys companion session (consistent IP for WA).

**Test**: Cloud phone device info shows proxyStatus: 1 (bound). WA on cloud phone shows correct proxy region.

---

## PHASE C — Warming: Production Hardening
**Priority: HIGH — core business value**
**Est: 3-4 days**

### C.1 — Richer behavior simulation
Rewrite warming.worker.js behavior loop by day range:

Day 1-3 (light):
- Set profile name (random nickname_library pick)
- Set profile picture (random avatar_library pick, sharp-resize 640x640)
- Send presence: available then unavailable
- Send 1 self-message with delay

Day 4-7 (medium):
- All above
- Mark incoming messages read
- Update status bio
- If warm group: send 1 short message

Day 8-10 (active):
- All above
- Send 2-3 warm group messages
- Reply to incoming with smstore template
- Send presence composing before messages

Randomization rules:
- All delays: rand(60000, 180000) ms between actions
- Daily action count: rand(dayMin, dayMax) by intensity
- Profile update: max once per 48h per account
- Skip any action with 20% probability (simulate offline day)

**Test**: Warm real number 3 days. Logs show varied actions, no ban, profile changes visible.

### C.2 — Anti-ban safety system
Create src/core/warming/WarmingSafetyMonitor.js:

preActionCheck(accountId):
- Check health_score > 30 (else throw — pause this account)
- Check daily_sent < MAX_DAILY_WARM_MESSAGES

updateHealth(accountId, { success, errorCode }):
- Lower score: disconnect, 409, 403
- Raise score: successful send, stable connection

checkGlobalBanSignal():
- If > N accounts errored in last hour: log GLOBAL BAN SIGNAL, pause all warming

**Test**: Force error on account. Health score drops. 3 consecutive errors auto-pauses warming.

### C.3 — Warm groups
New table warm_groups:
- id, group_jid, subject, admin_account_id, member_account_ids[], created_at

POST /warming/groups — supervisor creates warm group (uses SessionManager.createGroup)
POST /warming/groups/:id/add — add accounts as members
ws_accounts.warm_group_id — which warm group this account uses

**Test**: Create warm group with 3 test numbers. After warming run, group has messages from all 3.

### C.4 — Warming monitoring endpoints
GET /warming/summary
  { active, pending, completed, paused, avgDaysRemaining, recentCompletions }

GET /warming/tasks/:id/timeline
  Daily log of actions taken (from warming_action_logs table or metadata JSONB)

**Test**: Start 3 warming tasks, query summary. Timeline shows per-day actions.

---

## PHASE D — CS Desk: The Daily Driver
**Priority: HIGH — agents use this every day**
**Est: 5-6 days**
**Source: live RE of hf4cs.rocketgo.vip (see docs/hf4cs-re.md)**

### D.1 — Account list endpoint (Rocket-compatible)
GET /api/v1/desk/accounts
  Returns: {
    accountList: { total, rows: [{ id, username (phone), pushName, status, proxy: {host,port,type}, unread_count, last_message_at }] }
  }

Filter by agent permissions. Status: 1=online, 0=offline (match Rocket shape).

**Test**: Agent logs in, calls endpoint, only sees assigned accounts. unread_count correct.

### D.2 — Friends/contacts per WS account
GET /api/v1/desk/contacts?csUsername=<phone>&pageNum=1&pageSize=50
  Returns: { total, rows: [{ id, csUsername, username (phone), display_name, is_fans, is_block, labels, last_message_at, unread_count }] }

**Test**: Select WS account, contacts load. Label chips visible.

### D.3 — Chat log
GET /api/v1/desk/chat-log?csUsername=<phone>&contactPhone=<phone>&pageNum=1&pageSize=50
  Returns: { total, rows: [{ id, isSend, chatContent, chatType, sendTime, isRead, fileUrl, fileSec, quotedId, quotedText, notify }] }

chatType: 1=text, 2=image, 3=audio, 4=video, 5=sticker, 6=document

**Test**: Open conversation, full history visible. Audio message shows fileUrl + seconds.

### D.4 — Send message
POST /api/v1/desk/send
  Body: { csUsername, contactPhone, text, chatType?, mediaUrl? }
  Returns: { id, message_id, status: 'sent' }

Internally: SessionManager.sendText. Store in messages. Emit Socket.io wa:message.

**Test**: Agent sends → real phone receives. Stored in messages table. Visible in chat log API.

### D.5 — Real-time Socket.io rooms
```javascript
socket.join('desk:account:' + csUsername);
socket.join('desk:agent:' + agentId);

io.to('desk:account:' + csUsername).emit('wa:message', {...});
io.to('desk:agent:' + agentId).emit('wa:unread', { csUsername, count });
```

Wire messages.upsert from Baileys -> correct room emit + conversations.unread_count update.

**Test**: Real phone sends message. Agent sees it < 1s. Unread badge increments.

### D.6 — Unread tracking + mark read
GET  /api/v1/desk/unread — global unread count across all agent accounts
POST /api/v1/desk/mark-read?csUsername=&contactPhone= — sets unread_count=0, messages.is_read=true

**Test**: Receive 3 messages unread. Mark read. Badge clears.

### D.7 — Quick replies (smstore)
GET /api/v1/desk/quick-replies?category=
  Returns: [{ id, name, content }]

POST /desk/send with smstore_id expands content automatically.

**Test**: Agent opens quick reply panel, picks template, text populates.

### D.8 — Contact management from desk
POST /api/v1/desk/contacts/:phone/block     — is_block=true
POST /api/v1/desk/contacts/:phone/fans      — is_fans=true
POST /api/v1/desk/contacts/:phone/labels    — { labelIds: [...] }
GET  /api/v1/desk/contacts/:phone/history   — full history across all WS numbers

**Test**: Label, block, mark fan without leaving desk view.

### D.9 — Message revoke
POST /api/v1/desk/revoke
  Body: { csUsername, contactPhone, wa_message_id }

Calls sock.sendMessage(jid, { delete: messageKey }). Marks as revoked in DB.

**Test**: Send message, revoke, deleted on target phone.

### D.10 — Pinned conversations + filters
POST /api/v1/desk/contacts/:phone/pin — sets conversations.is_pinned=true
GET  /api/v1/desk/contacts?filter=unread|pinned|all|fans

**Test**: Pin contact, appears at top. Filter tabs switch correctly.

---

## PHASE E — Materials, Blasts, Group Pull
**Priority: MEDIUM**
**Est: 4-5 days**

### E.1 — Materials upload API (separate endpoints per type)
POST /api/v1/materials/avatars — upload image, sharp resize 640x640 JPEG
GET  /api/v1/materials/avatars
DELETE /api/v1/materials/avatars/:id

POST /api/v1/materials/nicknames — bulk add newline-separated or JSON array
GET  /api/v1/materials/nicknames
DELETE /api/v1/materials/nicknames/:id

POST /api/v1/materials/smstore — create quick-reply template
GET  /api/v1/materials/smstore
PUT  /api/v1/materials/smstore/:id
DELETE /api/v1/materials/smstore/:id

**Test**: Upload 5 avatars, 20 nicknames, 5 templates. Warming worker picks them randomly.

### E.2 — Batch profile apply
POST /api/v1/accounts/batch-apply-profile
  Body: { accountIds: [...], avatarId?, nicknameId?, randomize? }

BullMQ queue with 3s delays per account. Uses SessionManager.updateProfile.

**Test**: 5 accounts, batch apply random avatar + nickname. All profiles updated on WA.

### E.3 — Blast engine production hardening
Current blast worker is skeletal. Add:
- Per-number daily cap check (ws_accounts.daily_sent, reset midnight cron)
- Randomized delay: rand(3000, 15000) ms per message
- Template variable expansion {{ name }}, {{ phone }}
- Error handling per recipient: mark failed, continue rest
- Auto-pause if error rate > 20%
- Chunked processing: 50 recipients per job, re-queue next 50

POST /api/v1/blasts           — create campaign
POST /api/v1/blasts/:id/start — schedule first batch
POST /api/v1/blasts/:id/pause — pause between chunks
GET  /api/v1/blasts/:id/stats — { sent, failed, pending, delivery_rate }
GET  /api/v1/blasts/:id/export-unsent — CSV of recipients not yet sent

**Test**: Blast to 10 contacts. 3-15s delay between each. Stats live. 1 failure: marked, rest continue.

### E.4 — Group pull (mass group creation)
Improve groupPull.worker.js:
1. Create WA group (SessionManager.createGroup)
2. Get invite link (getGroupInviteCode)
3. Add participants with delays (addParticipantsToGroup)
4. Track success per member in group_pull_members table
5. Store group_jid in group_pulls record
6. Group appears in CS desk for group chat

POST /api/v1/group-pulls            — create task (admin number, target list)
POST /api/v1/group-pulls/:id/start  — kick off
GET  /api/v1/group-pulls/:id        — status + invite link + member count

**Test**: Create group pull, 10 test contacts. Group created. Invite link returned. Members added.

---

## PHASE F — Supervisor Desk Control Plane
**Priority: MEDIUM**
**Est: 3 days**

### F.1 — Port management
POST /api/v1/ports                — create (type, dates, notes)
GET  /api/v1/ports                — list with usage (numbers_assigned / max_numbers)
GET  /api/v1/ports/summary        — { total, active, expired, utilization_pct }
POST /api/v1/ports/:id/assign     — assign WS account to port
POST /api/v1/ports/:id/release    — release account from port

### F.2 — Account warehouse
POST /api/v1/accounts/:id/warehouse      — move to warehouse, release port
POST /api/v1/accounts/:id/unwarehouse    — pull from warehouse, assign port
GET  /api/v1/accounts?in_warehouse=true  — list warehouse
POST /api/v1/accounts/warehouse/export   — 6-segment CSV export

### F.3 — Account groups + batch ops
GET  /api/v1/account-groups
POST /api/v1/account-groups              — create group
POST /api/v1/account-groups/:id/members — { accountIds: [...] }
POST /api/v1/accounts/batch
  Body: { accountIds, action: 'connect'|'disconnect'|'apply_profile'|'enter_warming'|'export', params? }

### F.4 — Fan inheritance (number migration)
POST /api/v1/accounts/:fromId/inherit-to/:toId
  Body: { includeContacts, includeConversations, reason }

- Update contacts.cs_username from -> to
- Update conversations.ws_account_id from -> to
- Log in audit_logs
- Mark from as banned

### F.5 — Agent management
POST /api/v1/agents                  — create agent
GET  /api/v1/agents                  — list with stats
POST /api/v1/agents/:id/permissions  — { permissions: ['desk.chat', 'accounts.view', ...] }
GET  /api/v1/agents/:id/stats        — { messages_sent, conversations_handled, avg_response_ms }
DELETE /api/v1/agents/:id

### F.6 — Export management
POST /api/v1/exports             — create export task (type, filters)
GET  /api/v1/exports             — list with status + download link
GET  /api/v1/exports/:id/download — stream CSV/JSON file

All export operations create an export_tasks row + stream file.

---

## PHASE G — Frontend: Functional Desks
**Priority: MEDIUM — skeleton only currently**
**Est: 5-7 days**

### G.1 — Core layout + auth
- Login page with role-based redirect (supervisor desk vs CS desk)
- JWT storage + auto-refresh
- Socket.io connection management
- Global error toasts

### G.2 — CS Desk (based on hf4cs RE)
Left panel — Account list:
- Cards: WS number, status badge, unread count
- Click account: loads contacts

Middle panel — Contact list:
- Search bar
- Filter tabs: All / Unread / Pinned / Fans
- Contact rows: avatar, name/phone, last message preview, unread badge, label chips

Right panel — Chat view:
- Message bubbles (in=left, out=right)
- Types: text, image thumbnail, audio player, sticker, file download
- Reply indicator (quoted message)
- Send bar: text input + quick-reply button (smstore popup) + send button
- Contact actions: label, block, mark fan, pin

Real-time: wa:message updates bubbles. wa:unread updates badges.

### G.3 — Supervisor Desk
- Account table: search, sort, filter by status/group, batch checkbox actions
- Port management: table + utilization progress bars
- Warming tasks: table with day progress indicators + pause/resume
- Materials library: avatar grid, nickname list, smstore cards
- MoreLogin onboarding modal: phone input -> pairing code display -> link progress

### G.4 — Pairing / Onboarding UI modal
Step 1: Enter phone number (+ optional: auto-acquire from Grizzly)
Step 2: Loading: "Creating cloud phone..."
Step 3: Show pairing code prominently: "Enter in WhatsApp: 1234-5678"
Step 4: "Connecting..." -> on wa:connected -> "Linked! Start warming?"
QR fallback option available throughout.

### G.5 — Warming status UI
- Account cards with progress bars (day 3/10)
- Actions per card: pause, resume, view timeline
- Global stats header: total warming, completed this week, bans detected

---

## PHASE H — Production Hardening
**Priority: HIGH — before any real volume**
**Est: 3-4 days**

### H.1 — Rate limiting
express-rate-limit:
- Per-IP: 100 req/min general API
- Per-user: 20 req/min for send endpoints
- Blast: max 1 start per 10 min per account

ws_accounts.daily_sent counter + midnight reset cron job.

### H.2 — Proxy health auto-rotation
ProxyService.checkHealth():
- 3 consecutive failures: mark status='dead'
- Account with dead proxy: auto-assign next active proxy (log loudly if none)

POST /proxies/rotate-dead — supervisor manual rotation sweep.
BullMQ repeatable job: proxy-health-check every 30 min.

### H.3 — Auth state backup + recovery
Daily export job: dump all non-null baileys_auth_state to ./backups/auth-state-YYYY-MM-DD.json.enc (encrypted).
POST /admin/restore-auth-state — restore from backup file.

**Test**: Nuke auth state for one account, restore from backup, session reconnects without re-linking.

### H.4 — Session auto-recovery improvements
- Exponential backoff: 1s -> 2s -> 4s -> ... -> max 60s
- After 10 consecutive failures: mark status='error', stop retrying, emit alert
- POST /sessions/:accountId/recover — supervisor triggers manual reconnect

### H.5 — Health + monitoring endpoints
GET /health — { status, db, redis, activeSessions, timestamp }
GET /health/sessions — per-session: phone, status, proxy, reconnect_attempts
GET /health/queues   — BullMQ queue sizes (warming, blast, group-pull)
GET /health/proxies  — proxy health summary (active/degraded/dead counts)

### H.6 — Docker + deployment
- Dockerfile (node:20-slim, non-root, health check)
- docker-compose.yml (app + postgres + redis)
- .env.production.example
- scripts/backup.sh (auth-state + DB dump)
- Document: ~50-100 light Baileys sessions per GB RAM

### H.7 — Audit logging
Every destructive/batch operation writes to audit_logs:
- Account delete, status change
- Blast create/start/stop
- Warming pause/resume
- Fan inheritance
- Agent permission change

GET /api/v1/audit-logs?entity_type=&action=&from=&to= for supervisor.

---

## PHASE I — Testing + Validation
**Est: 3-4 days (overlaps other phases)**

### I.1 — End-to-end onboarding test
1. POST /cloud/acquire-and-onboard (or manual phone + code)
2. Pairing code returned
3. Enter in MoreLogin cloud phone WA
4. Verify: ws_accounts.status=linked, display_name populated, baileys_auth_state non-null
5. Power off cloud phone
6. Send test message from desk -> arrives on real phone
7. Real phone replies -> appears in desk < 1s

Gate: 2 numbers pass this before volume testing.

### I.2 — Warming 10-day test
- Day 1-3: Profile changes confirmed (avatar, nickname)
- Day 3-7: Presence updates, warm group messages visible
- Day 7-10: Completion, status -> active
- Health scores stayed > 60, no bans

### I.3 — CS Desk load test (5 agents, 20 accounts)
- 5 agent users, 20 accounts assigned
- Incoming messages from real phone -> all permitted agents see in < 2s
- Unread counts correct
- Revoke works across accounts

### I.4 — Blast safety test
- Fan blast to 50 contacts
- Verify: no two messages < 3s apart
- Kill process mid-blast, restart, blast resumes from correct position
- daily_sent cap triggers correctly

---

## IMMEDIATE NEXT ACTIONS (Start Here Today)

1. [ ] Run existing migrations: npm run migrate (fix any errors first)
2. [ ] Write + run migration 008 (ws_accounts auto_warm + warming flags)
3. [ ] Write + run migrations 009-012 (labels, smstore, conversations, exports)
4. [ ] Register proxy via API:
        POST /api/v1/proxies/quick-add { "url": "http://148.113.193.96:5959" }
        Save returned proxy UUID
5. [ ] Link your 2 existing numbers (they're already registered on WA):
        a. Get auth token: POST /api/v1/auth/login { email, password }
        b. Mark account ready: POST /api/v1/sessions/<accountId>/mark-registered
        c. Connect: POST /api/v1/sessions/connect { phone, usePairingCode: true, proxyId: "<uuid>" }
        d. Enter pairing code in WhatsApp on your phone
        e. Verify: GET /api/v1/sessions -> status=linked
6. [ ] Start warming: POST /api/v1/warming/enter { ws_account_id, mode: "normal", target_days: 10 }
7. [ ] Upload 5 avatars + 10 nicknames to materials library
8. [ ] Begin Phase A migrations in parallel with testing above

---

## Dropped / Deprecated (Waydroid)

NOT to be used for new numbers:
- src/scripts/provision-waydroid.js (keep for reference only)
- src/cloud/emulator.service.js (legacy adapter — routes to MoreLogin internally)
- docs/CLOUD_PHONELESS.md Option A (Waydroid section) — outdated
- Migration 003 (Waydroid-specific fields) — schema kept, provider=morelogin is default

All new onboarding goes through MoreLogin. cloud_emulators table is now MoreLogin-centric.

---

## Estimation Summary

| Phase | Description                      | Est Days | Priority    |
|-------|----------------------------------|----------|-------------|
| A     | DB Schema completion             | 2        | IMMEDIATE   |
| B     | MoreLogin onboarding flow        | 3-4      | IMMEDIATE   |
| C     | Warming production hardening     | 3-4      | HIGH        |
| D     | CS Desk API + real-time          | 5-6      | HIGH        |
| E     | Materials, Blasts, Group Pull    | 4-5      | MEDIUM      |
| F     | Supervisor desk control plane    | 3        | MEDIUM      |
| G     | Frontend (React + Socket.io)     | 5-7      | MEDIUM      |
| H     | Production hardening + Docker    | 3-4      | HIGH        |
| I     | Testing + validation             | 3-4      | ONGOING     |

Total: 31-43 focused dev days for fully production-ready system.
Minimum viable (link + warm + basic desk): ~10-14 days (A + B + C + D.1-D.6 + H.1-H.4).

---

## Architecture Quick Reference

```
MoreLogin Cloud Phone (temp)             Baileys Companion (permanent)
+---------------------------+            +--------------------------------+
| Android 15 (sku 10004)    |            | SessionManager.js              |
| WhatsApp primary          |            | - makeWASocket per account     |
| Register with SMS code    | ---------> | - DB auth state (encrypted)    |
| Enter Baileys pairing code|  link      | - Proxy agent per socket       |
| Power off after link      |            | - Events: messages, connected  |
+---------------------------+            +------+-------------------------+
                                                |
                                       +--------+--------+
                                       |                 |
                                BullMQ Workers      Socket.io rooms
                                - warming          - desk:account:<phone>
                                - blasts           - desk:agent:<id>
                                - group-pull       - desk:supervisor
                                - proxy health
                                - midnight resets

Postgres (wa_control_dev)
- ws_accounts (phone, status, baileys_auth_state encrypted, proxy_id, auto_warm)
- conversations + messages (chat history, unread_count, cs_username)
- contacts + fan_labels + contact_label_map
- avatar_library + nickname_library + smstore
- warming_tasks + warm_groups
- blast_campaigns + blast_recipients
- cloud_emulators + registration_logs (MoreLogin records)
- export_tasks
- proxies + ports + account_groups
- users (supervisor + agents) + permissions + audit_logs
```
