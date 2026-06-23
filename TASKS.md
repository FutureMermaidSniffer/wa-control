# WA Control — Comprehensive Sequential Implementation Tasks (Agent-Assignable)

**Project**: wa-control (completely independent from previous whatsapp-saas)
**Objective**: Ship a holistic raw-control WhatsApp system that replicates (and can exceed) the functionality and operational feel of the Rocket WS Cloud Control PDF manual, adapted for your constraints:
- Legal / owned numbers & contacts only in real use.
- Full proxy support per port/number (geo for different clients/areas).
- Full number warming system for **your own numbers only** (no hijacked numbers enter warming).
- Implement **every** core feature from the PDF (including cold blast, "hijack" login flows, port purchase, fan inheritance, group pull with privileged adds, etc.) for completeness and future flexibility. In your daily operation, simply don't use the cold paths and label/flag all numbers as "org-owned".

**"Raw control" definition**: Full linked-device session control (Baileys) — QR/pairing login, live presence, free profile (avatar/nick) mutation, group admin actions, behavioral simulation for warming, per-number proxying, etc. This is **not** the high-level official Cloud API system.

**Built on Baileys**: Yes. We use `@whiskeysockets/baileys` for all WhatsApp protocol, auth (multi-device linking), messaging, groups, profile, events, etc. We do **not** re-implement the protocol. We **do** build production-grade multi-session management, custom DB-backed auth state, proxy-per-socket, health/reconnect logic, and all the higher-level control planes (ports, warming, desks, blasts, etc.).

**Time & Effort Estimate (realistic)**:
- **Optimistic (experienced team, heavy parallelization with agents, focused scope)**: 8–12 weeks to a very usable v1 that covers 85-95% of PDF core flows (numbers/ports/warming/desk/blasts/groups/materials basic end-to-end, realtime chat, exports). Many PDF "pages" are simple CRUD + screenshots.
- **Realistic (accounting for Baileys pitfalls: auth state corruption, reconnect storms, proxy quality, ban surface, key management, frontend parity, testing with real numbers)**: 14–20 weeks for a solid, monitorable, production-usable system close to full PDF feature parity + your proxy/warming requirements.
- **Pessimistic (scaling to dozens/hundreds of ports, full hardening, nice UI matching PDF density, ops tooling)**: 5–7+ months.
- Single senior dev + 1-2 agents: Closer to 4–6 months.
- Key risk areas that always take longer than expected in Baileys systems: Stable multi-session manager, custom auth state in Postgres, proxy reliability + rotation, warming behavior that doesn't trigger bans, realtime desk under load, recovery from disconnects/bans.

**How to use this doc with agents**:
- Tasks are numbered sequentially with clear phases.
- Each task has: Description, Prerequisites, Acceptance Criteria (DoD), Suggested agent type (backend-engine, api, frontend, infra, testing), Est. ideal dev-days.
- Many tasks in later phases can be parallelized once prereqs are done (e.g. different desks, different blast types, frontend pages).
- Use the live `todo_write` / task tracking in the environment.
- "ASAP" means prioritize critical path: 0-Setup → 2-WA Core Engine (the heart) → 3-Ports & Numbers → 4-Warming (your req) → 8-Customer Service Desk (the daily driver) + supporting (materials, contacts, blasts).
- Always implement with audit logging, per-number rate limiting / delays (randomized), consent/opt-in flags (even for "cold" features), and health scoring.
- For "hijacked" flows: Implement exactly as PDF (scan login, etc.). Internally store `acquisition_method: 'org_registered' | 'scan_linked' | 'phone_assoc'` (all treated as owned by you).

**Tech Decisions (locked for v1)**:
- Language: JavaScript (ESM) + JSDoc (fast, matches existing team knowledge from the other project). Can migrate hot paths to TS later.
- Backend: Express + Socket.io.
- DB: Postgres + Knex (migrations manual, consistent with prior project).
- Jobs/Queues: Redis + BullMQ.
- WA Engine: @whiskeysockets/baileys (latest stable).
- Auth: JWT (access + refresh) for supervisor + agents. Role: `supervisor | agent | admin`. Granular permissions like PDF (batch ops, warming control, view all, etc.).
- Realtime: Socket.io rooms per desk/session.
- Storage: Local disk first (materials, auth-state backups, exports) → S3 later. Sharp for image processing (resize avatars).
- Config: Zod-validated .env.
- Logging: Winston + structured.
- No multi-tenancy in v1 (single operator + team like PDF). Can add later if you have multiple "orgs/clients".
- Frontend: Start with a pragmatic React (Vite) SPA or even progressive HTML/JS + htmx for speed. Goal is functional desks that feel like the PDF screenshots. Prioritize backend + Socket so a good frontend can be built against it.

---

## Phase 0: Project Bootstrap & Foundation (1-3 days)

**0.1** Project scaffolding, deps, basic run
- Prereqs: None
- Do: `npm install` (core + dev: nodemon, jest, supertest, etc.), add scripts (dev, start, migrate, seed, test), .gitignore, .env.example, basic folder structure already created.
- Add Baileys-specific: pino (Baileys likes it), @hapi/boom, etc.
- Create basic `src/index.js` that starts Express + Socket.io + DB connection check + health.
- Acceptance: `npm run dev` starts server on :3000, /health returns 200, logs "WA Control starting".
- Agent: infra/backend. Est: 0.5d

**0.2** Database setup (Knex + Postgres) + first migrations
- Prereqs: 0.1
- Do: knexfile.js (dev/test/prod), src/db/connection.js, first migrations for core entities (see schema in 1.1).
- Create test DB handling (like prior project).
- Seed basic supervisor user + permissions.
- Acceptance: `npm run migrate` succeeds, can connect, basic tables exist, seed works.
- Agent: backend. Est: 1d

**0.3** Core config, logging, error handling, validation middleware (Zod)
- Prereqs: 0.1
- Do: src/config/index.js (Zod schema for DB, JWT, REDIS, BAILEYS, PROXY defaults, etc.), utils/logger.js, middleware/errorHandler, notFound, validate.js.
- Acceptance: Invalid config fails fast with clear errors. All routes will use validate.
- Agent: backend. Est: 0.5d

**0.4** Basic auth foundation (users, roles, JWT, permissions)
- Prereqs: 0.2, 0.3
- Migrations: users, roles, permissions, role_permissions, refresh_tokens, audit_logs.
- Services for register/login (supervisor creates agents), me, refresh.
- Middleware: authenticate, requirePermission, requireRole (supervisor can do everything).
- Simple seed: one supervisor user.
- Acceptance: POST /auth/login returns tokens, protected route works, permission check blocks.
- Agent: backend. Est: 1.5d

**0.5** Basic frontend skeleton (Vite + React or lightweight)
- Prereqs: None (can start parallel)
- Do: frontend/ with Vite, basic login page, layout with "Supervisor Desk" and "CS Desk" tabs/sections, API client (fetch + socket).
- Later pages will be filled task-by-task.
- Acceptance: Can serve frontend on :5173 (proxy to backend) or integrated, login form hits API.
- Agent: frontend. Est: 1d

---

## Phase 1: Data Model & Core Domain (parallel with 0 after bootstrap)

**1.1** Full DB schema design & migrations for PDF core entities
- Prereqs: 0.2
- Tables (design carefully):
  - ports (id, type: 'normal'|'fast_warm', purchased_at, starts_at, expires_at, status, notes, internal_cost, capacity_used, ...)
  - whatsapp_accounts (or ws_numbers): id, port_id (nullable), phone, jid, display_name, avatar_url (current), status (active|warming|warehouse|offline|error|banned), acquisition_method ('org_registered'|'scan_linked'|'phone_assoc'), proxy_id (FK), group_id, is_in_warehouse, warm_pool_id, last_seen, health_score, daily_message_count, etc. Store Baileys auth state reference or JSONB (creds + keys — careful with size/encryption).
  - account_groups
  - proxies (id, name, host, port, username, password_enc, type: 'http'|'socks5', region, status, last_checked, success_rate, ...)
  - warming_tasks / warming_pools
  - materials (type: 'avatar'|'nickname'|'message', content/url, name, category, usage_count, created_by)
  - contacts (phone unique, source, tags JSONB or join table for multiple, opted_in, dnd, assigned_agent_id?, notes, created_via_diversion_link_id?, ...)
  - contact_tags, contact_groups (for blast targets)
  - diversion_links (id, short_code or path, target_ws_account_id, name, stats: leads_captured, ...)
  - blast_campaigns (type: 'fan'|'cold', target_type, status, stats, created_by, ...)
  - blast_recipients
  - group_pulls (group pull tasks)
  - conversations / messages (for desk history + inheritance)
  - agent_stats, exports, audit everywhere.
  - webhook_logs or event_logs if needed.
- Include soft deletes, timestamps, tenant-like scoping if easy (or just `owner` for future).
- Acceptance: All core tables migrated, indexes for common searches (by phone, status, port, group), seeds for sample ports/proxies.
- Agent: backend/data. Est: 2d (design + impl)

**1.2** Data access layer (src/data/*) for all entities
- Prereqs: 1.1
- Knex query builders: find, list (paginated + filters like PDF search), create, update, count, specific (e.g. assign port, move to warehouse, inherit fans).
- Acceptance: Unit tests (mock knex) or integration that cover CRUD + key business queries (e.g. available ports, numbers eligible for warming).
- Agent: backend. Est: 2d

---

## Phase 2: WA Core Engine — The Heart (Critical Path, highest priority after foundation)

**2.1** Baileys Session Manager core (src/core/sessions/SessionManager.js)
- Prereqs: 0.3, Baileys installed, 1.1 (at least accounts table)
- This is the most important piece.
- Responsibilities:
  - Load/create Baileys socket per ws_account (or per port).
  - Custom auth state store: Implement `useDBAuthState` (inspired by useMultiFileAuthState but Postgres + encryption for keys/creds). Store per account. **Never rely on filesystem only in prod.**
  - Inject proxy: For each socket, create agent (https-proxy-agent or socks) from the assigned proxy row. Pass as `agent` / `fetchAgent` / socket config.
  - Connection lifecycle: connect, disconnect (graceful), reconnect with backoff, QR generation (emit via socket.io or return base64), pairing code.
  - Event handling: messages.upsert, connection.update, presence, group updates, etc. Route to handlers (store messages, update health, trigger bots if any, etc.).
  - In-memory registry of active sockets + persistence of "desired state" (should be online?).
  - Presence control (available/unavailable for "online" feel during warming/active).
  - Profile updates (updateProfileName, updateProfilePicture from materials).
  - Group actions (create group, add participants, get invite code, leave, etc.).
  - Send helpers with delays (randomized 1-8s etc. to look human).
- Support QR scan login and phone number association login exactly.
- Acceptance: Can create a session, display QR (via API + event), scan with real phone (or test number), it goes "online", can send/receive a message, reconnect after kill, proxy is applied (verify via logs or external IP check if possible), auth state survives restart.
- Warning: This task will iterate. Plan 3-5 iterations with real device testing.
- Agent: **backend-engine specialist** (must know or learn Baileys deeply). Est: 5-8d (biggest single task)

**2.2** Proxy service + health checker
- Prereqs: 2.1 (basic)
- CRUD for proxies (add, test connectivity, assign to port/account).
- Background job (Bull) that periodically checks proxy health (fetch a test URL via the agent, success rate, latency).
- When assigning to a session: validate proxy works.
- Acceptance: Can add SOCKS5/HTTP proxy, health job updates status, sessions fail gracefully or fallback if proxy bad.
- Agent: backend. Est: 1.5d

**2.3** Integration: whatsapp_accounts <-> live sessions
- Prereqs: 2.1, 1.2
- On "login/activate" for a number: allocate port if needed, assign proxy if not, start session via manager, update DB status.
- "Offline" / logout: stop socket cleanly, update status.
- Batch operations skeleton (login many, set offline many).
- "One key" actions exposed.
- Acceptance: From API, "activate" a number → QR or auto if creds exist → it appears online in status. Change status in DB reflects in manager.
- Agent: backend-engine. Est: 2d

**2.4** Basic health, monitoring, auto-recover for sessions
- Prereqs: 2.3
- Per-account health_score (updated on disconnects, send success, message volume patterns).
- Auto re-connect logic with jitter.
- Alerts (logs + later admin endpoint) for "many in error".
- Acceptance: Kill a socket process-side → manager detects and recovers within N seconds. Bad proxy leads to clear error state.
- Agent: backend. Est: 1.5d

---

## Phase 3: Ports, Accounts, Groups, Warehouse, Import (PDF Supervisor flows)

**3.1** Port purchase / allocation system (full PDF port records)
- Prereqs: 1.1, 2.1
- Endpoints + services: "purchase" port (internal: create record with type, dates, notes), list ports with usage (how many numbers assigned, remaining capacity), expiry warnings, assign port to number or free it.
- Types: normal (default 10d warm), fast_warm (fast warm, "1500 ports" special? — implement as flag that allows faster/more aggressive warming schedule).
- Warehouse ports are "independent".
- Acceptance: Can purchase 10 normal ports, see in list with 0 used, assign to a WS number, used count increases, expiry query works.
- Agent: backend. Est: 1.5d

**3.2** WS Number (account) CRUD, groups, batch ops, import (6-segment or CSV)
- Prereqs: 3.1, 2.3
- Import: support the standard six-segment number format or flexible CSV (phone, label, initial proxy?, group?).
- Groups: create, assign numbers, batch move.
- Batch: login selected, set offline, apply avatar/nick from materials (random or specific), update label.
- One-key ops.
- Data migration / single fan inherit (reassign contacts + recent convos to another number).
- Delete record logging.
- Acceptance: Matches PDF page 6 flows (search, batch, one-key, data migration). Import creates accounts + optional auto port assignment.
- Agent: backend. Est: 2.5d

**3.3** Account Warehouse
- Prereqs: 3.2
- Move numbers to/from warehouse (releases or consumes independent warehouse port).
- List warehouse with search, batch ops, export 6-segment.
- Acceptance: PDF page 9 flows work.
- Agent: backend. Est: 1d

**3.4** Delete records, basic stats for accounts
- Prereqs: 3.2
- Audit every delete + reason.
- Per-account activity summary (messages sent last 7d, fans, etc.).
- Acceptance: Can query deletion history as in PDF.
- Agent: backend. Est: 0.5d

---

## Phase 4: Warming System (Warming Pool + Tasks) — Your Explicit Requirement

**4.1** Warming pool & task model + CRUD
- Prereqs: 1.1, 3.2 (numbers can be offline)
- UI/API: Move offline number into warming pool (must be offline).
- Create warming task: mode (default 10 days, fast warm), schedule, intensity, assigned port/proxy if needed.
- Searchable list of warming numbers/tasks (PDF p16).
- Acceptance: Number enters pool, task created, status "pending" → "executing".
- Agent: backend. Est: 1d

**4.2** Warming execution engine (job + behavior simulator)
- Prereqs: 2.4 (live sessions), 4.1
- BullMQ repeatable or scheduled job that picks "executing" tasks.
- For each: ensure session is connected (via manager), perform human-like actions over days:
  - Update profile (pick random avatar from materials, nick from materials) — gradually.
  - Send test messages to self or small set of test contacts.
  - Update status message.
  - Simulate light receiving (if test convos exist).
  - Join/leave a "warm group" slowly.
  - Vary timing, volume per day (ramp up).
- Different schedules for normal vs fast warm.
- Track progress (day 3/10), health during warm.
- Safety: Never aggressive, randomized, respect per-number daily caps, auto-pause on errors.
- "Only our own numbers" — enforced by acquisition flags + no special hijack during warm.
- Acceptance: Start a 3-day test warm task on a real owned number (with proxy). Over days it performs profile changes + light activity without obvious spam patterns. Can pause/resume.
- Agent: **backend-engine + careful testing**. Est: 4-6d (iterative, test with real devices)

**4.3** Warming monitoring, completion, exit to active
- Prereqs: 4.2
- On task complete (or manual): move number out of pool, mark ready for use, perhaps auto-apply "graduation" profile.
- Dashboard: how many in warm, success rate, bans during warm (rare hopefully).
- Acceptance: Full flow: enter → execute days → exit ready. Matches PDF p13-16.
- Agent: backend. Est: 1.5d

---

## Phase 5: Contacts, Tags, Data Pool, Diversion Links

**5.1** Contacts / fans full (search, tags/labels, groups, notes, import/export)
- Prereqs: 1.1, 1.2
- Matches PDF p17: search, tag list (multi-tag per contact), assign tags in list.
- CSV import for data pool (contact data pool p18).
- Export unused.
- Opt-in / DND / type (lead vs existing fan).
- "Pull to CS desk" integration later.
- Acceptance: All PDF fan list + label + data pool flows. Assigned tags visible.
- Agent: backend. Est: 2d

**5.2** Diversion / diversion links + per-WS attribution stats
- Prereqs: 5.1, 3.2
- Create link (short code or /join/xxx). Visitor "registers" or sends a message? (or form that creates contact attributed to the WS number).
- Or: unique invite links that when used create a contact + optionally start a convo on that number.
- Stats per link and per WS number (how many fans this number brought in).
- Acceptance: Create diversion link for a number, "capture" a test lead via it, stats increment, visible in account detail (PDF p10).
- Agent: backend. Est: 1.5d

---

## Phase 6: Materials Library + Blasting

**6.1** Materials library: avatars, nicks, messages (p28-29, p52)
- Prereqs: 1.1
- Upload avatars (images, process with sharp: resize, optimize).
- Nickname lists (bulk add text).
- Message templates (with {{vars}} like old templates).
- Use in: profile apply (during warm or batch), quick replies in desk, blasts.
- Sender attribution / category.
- Acceptance: Upload 5 avatars, 10 nicks, 3 message templates. Can select for use in other flows.
- Agent: backend. Est: 1.5d

**6.2** Blast engine foundation (queues, per-number limits, safety)
- Prereqs: 2.4 (send via live sessions), 5.1, 6.1
- Shared blast service: pick targets (group or custom list or data pool), exclude opted-out/DND, create recipients, enqueue with randomized delays.
- Per-number daily cap + global safety throttle.
- Full status (draft/scheduled/running/paused/completed), live counters (sent/failed), export unsent.
- Two types: fan blast (to existing contacts/fans) and cold blast (cold to strangers from blast number pool).
- For cold: support dedicated number pool or just arbitrary list import.
- Acceptance: Can create a small fan blast to 5 owned contacts, it runs via real sessions with delays, stats update, can pause/export unsent.
- Agent: backend + jobs. Est: 3d

**6.3** Blast number pool (cold pool) + cold blast UI/flows (p19-20)
- Prereqs: 6.2
- Dedicated storage or tag/filter for "cold blast numbers".
- Blast using it, stats (PDF p19 "click More, then Statistics").
- Acceptance: Full cold blast flow as PDF, even if you won't use daily.
- Agent: backend. Est: 1d

**6.4** Fan blast + stats + export unsent (p24)
- Prereqs: 6.2
- Target existing fans/contacts (by group/tag/status).
- Right-side statistics panel, export unsent.
- Acceptance: PDF p24 flows.
- Agent: backend. Est: 0.5d (mostly covered by 6.2)

---

## Phase 7: Group Tools (Group Pull Management) + Inheritance

**7.1** Group pull tasks (p34-39)
- Prereqs: 2.1 (group actions in Baileys), 3.2
- Create task: choose "admin" number(s) that will have privileges (scanned/owned with rights), target list or count, group subject.
- Execute: create group (or use existing), generate invite code / QR (display in UI), add members using the admin number(s).
- Note per PDF: scan-linked numbers (typically scan-linked numbers have group-add privileges) — implement the flow; in your case the "hijack" numbers are your controlled org numbers.
- View created groups list.
- Acceptance: Full end-to-end: create task → QR appears → "add" test members via a privileged number → group visible with members.
- Agent: backend-engine. Est: 2.5d

**7.2** Fan inheritance / data migration for "banned" or dead numbers (p7, p48)
- Prereqs: 5.1, 3.2
- Mark number as dead/banned.
- Wizard: choose receiver number (must share "same CS" concept — use same group or agent?).
- Move contacts, recent messages/history, tags, diversion attribution?, update stats.
- Acceptance: Select banned number + receiver → fans appear on receiver, history accessible in desk under new number.
- Agent: backend. Est: 1d

---

## Phase 8: Customer Service Desk — The Daily Operational Heart (p25-27, p40-47, p50)

This is what agents use 90% of the time. Prioritize highly.

**8.1** Agent auth + CS list / permissions / stats (p25-27)
- Prereqs: 0.4
- Agents are users with role `agent`.
- Batch modify permissions (what numbers they can see/use, blast rights?, tag rights?).
- Per-agent stats (handled convos, response time, messages, etc. — track in messages table with sender).
- Separate "CS login" (same credentials, different landing or role-based UI).
- Acceptance: Create 3 agents, give different perms (one can only see certain groups/numbers), stats page shows activity after they chat.
- Agent: backend. Est: 1.5d

**8.2** Core desk realtime + sessions view (p41-46)
- Prereqs: 2.4 (sessions live), 8.1, Socket.io setup
- On CS login: see list of WS numbers they have access to + their sessions (unread counts, last message, pinned?).
- Click WS number → see customer list (fans/contacts that have history with it).
- Click customer → open chat thread (full history, realtime incoming).
- Filters: unread, all, pinned, by group.
- "Account grouping" and "session grouping" as in PDF.
- Use Socket rooms: `desk:agent:<id>`, `session:<ws_account_id>`.
- Incoming messages from Baileys → create/update conversation → emit to relevant agents.
- Outbound: agent types → send via the correct ws_account's live socket → store message.
- Acceptance: Two agents + two numbers. Real phone sends to one number → both (or permitted) agents see it live in desk, can reply from the desk, other sees it. Matches PDF chat flow.
- Agent: **backend + realtime specialist**. Est: 4d (core value)

**8.3** Group chat in desk, revoke, address book pull (p43-44)
- Prereqs: 8.2, 7.1
- Groups created via group pull appear in the desk for permitted agents.
- Chat in group as the WS number.
- Right-click revoke (delete for everyone? or just you — implement what Baileys supports + log).
- Address book: manual pull / search fans, add to current session or assign.
- Acceptance: Supervisor creates group with group pull, it shows in CS desk, agent can send in group, pull a contact into the session view.
- Agent: backend. Est: 2d

**8.4** Quick replies from materials, settings, full filters (p47, p52)
- Prereqs: 6.1, 8.2
- In chat compose: button for materials (message templates) → insert/send.
- Unread / all / pinned / search as PDF.
- Per-agent settings (sound? default view?).
- Acceptance: Agent sends a quick reply from material in a convo. PDF-like session filters work.
- Agent: backend + frontend. Est: 1d

**8.5** Chat history viewer + export (p31)
- Prereqs: 8.2
- Full exportable history per contact or per number or global (with filters).
- Central export management (p32, p53): list of all generated exports, download links (CSV/JSON or ZIP of media?).
- Acceptance: Export a conversation or full number history, appears in export mgmt, downloadable.
- Agent: backend. Est: 1d

---

## Phase 9: Supervisor Desk Additional + Exports/Stats (remaining PDF pages)

**9.1** Full account grouping, search, one-key, migration in supervisor UI flows
- Prereqs: 3.2, backend complete
- Replicate the left nav + right actions from PDF screenshots.
- Acceptance: Supervisor can do everything in p5-6, p48 exactly as manual.
- Agent: backend + frontend. Est: 1.5d

**9.2** Central export management, all export types
- Prereqs: 8.5, 6.2
- Unified place for contact exports, blast unsent, histories, group members, etc.
- Acceptance: Any export from any module lands here and is downloadable.
- Agent: backend. Est: 0.5d

**9.3** CS agent stats + overall dashboard (p27, p39)
- Prereqs: 8.1
- Supervisor views per-agent + aggregate (fans brought in via diversion per number, blast success, warm success, etc.).
- Acceptance: Stats pages match PDF intent.
- Agent: backend + frontend. Est: 1d

**9.4** Settings, audit log viewer, basic system health
- Prereqs: foundation
- Global settings (default warm days, blast rate limits, proxy rotation policy, etc.).
- Viewable audit log (who did what to which number/contact).
- Health: port utilization, number of live sessions, proxy health summary, recent errors.
- Acceptance: Supervisor can configure and see history of actions.
- Agent: backend. Est: 1d

---

## Phase 10: Frontend Desks to Match PDF Visual/UX Density + Polish

**10.1** Supervisor desk pages (import, groups, ports, warehouse, warming tasks, materials, diversion, blasts, group pull, stats)
- Prereqs: Backend phases 3-7, 9 mostly done
- Build pages that look/feel like the screenshot flows (tables with search, batch checkboxes, right-click or "more" menus, status badges "executing", QR modals, etc.).
- Use the API + Socket for live updates (e.g. task status changes).
- Agent: frontend. Est: 4-6d (big UI work)

**10.2** CS Desk full UI (sessions, chat bubbles, materials quick select, group chat, address book, filters, agent switcher)
- Prereqs: 8.x complete backend, 10.1 patterns
- Real-time chat that feels native (input, send, incoming bubbles, typing, unread badges).
- Multi-number switcher, customer list per number.
- Agent: frontend (with backend support for any missing events). Est: 4-5d

**10.3** Login flows for supervisor vs CS, role-based routing, responsive or desktop-like layout
- Prereqs: 0.5, 8.1
- After login, land in correct "desk" or have switcher (supervisor desk / customer service desk).
- Permission-driven UI (hide buttons if no perm).
- Acceptance: Agent logs in → sees only CS desk + limited numbers. Supervisor sees full control.
- Agent: frontend. Est: 1.5d

**10.4** Polish: loading states, error toasts, confirmation modals (esp for batch/dangerous), mobile-unfriendly but desktop-optimized (like PDF)
- Prereqs: 10.1-10.3
- Make it feel production-ready for ops team.
- Agent: frontend. Est: 2d

---

## Phase 11: Hardening, Ops, Testing, Legal Safeguards, Documentation

**11.1** Comprehensive testing (unit for services, integration for flows, some E2E with test numbers)
- Prereqs: Core features
- Especially: session manager (mock Baileys where possible, or use test creds), warming job, blast safety (no over-send), auth/perm.
- Acceptance: `npm test` has good coverage on critical paths. Manual happy path with 2-3 real numbers documented.
- Agent: testing + backend. Est: 3d

**11.2** Rate limiting, consent, audit everywhere, anti-abuse
- Prereqs: All blasting/warming
- Global + per-number rate limiters (even for "raw").
- Every contact has source + consent flag.
- All blasts/warms log with "justification".
- Supervisor can set max daily per number.
- Acceptance: System refuses to blast 1000 strangers in 1 minute. Full audit trail.
- Agent: backend. Est: 1.5d

**11.3** Production deployment notes, Docker, monitoring, scaling guidance
- Prereqs: Core stable
- Dockerfile, docker-compose (postgres, redis, app).
- Guidance: memory/CPU for N sessions (Baileys is lighter than full browsers), horizontal (multiple instances with sticky? or session affinity via Redis pub/sub for sockets), proxy pool management.
- Health endpoints, Prometheus metrics stub.
- Backup strategy for auth state (critical — losing keys = re-scan many numbers).
- Acceptance: Can `docker compose up`, basic monitoring endpoints.
- Agent: infra. Est: 2d

**11.4** Full user manual / operator guide (internal) + API docs (if exposing)
- Prereqs: All features
- Document every PDF-like flow + your additions (proxies, warming specifics, "owned only" policy).
- Acceptance: New operator can follow and perform import → warm → desk chat → blast qualified → pull group.
- Agent: docs + any. Est: 1.5d

**11.5** Final integration, bug bash with real volume (10-20 numbers)
- Prereqs: 11.1-11.4
- Run a 1-week simulated operation: import, warm some, diversion capture, qualified blast, agent handling live chats, one group pull, stats review, export.
- Fix whatever breaks (reconnects, proxy flaps, UI state sync, etc.).
- Acceptance: Stable multi-day run with your real owned numbers + proxies. Matches or exceeds PDF operational capability for the features you care about.
- Agent: whole team. Est: 3-5d

---

## Parallelization Notes & Critical Path

**Critical path for "ASAP" usable system**:
0.5 (bootstrap) → 2.1 (SessionManager — do early, iterate) → 2.3 + 3.1/3.2 (numbers + ports live) → 4.1-4.3 (warming, your key req) → 8.1-8.2 (basic CS desk with live chat) + 5+6 (contacts + qualified blast) + 6.1 (materials).

Frontend can run in parallel after APIs stabilize (use mock data or contract-first).

Many Phase 6,7,9,10 tasks are parallelizable once engine + contacts + materials exist.

**Total ideal dev-days (rough, one person)**: ~60-90 days of focused work. With 3 people (engine specialist + backend + frontend) + good task assignment: 4-7 weeks for strong MVP, 12+ weeks for near-full.

**Risk buffer**: Always add 30-50% time for Baileys session flakiness and real-device testing.

---

## Next Immediate Actions (after reading this)

1. Review and approve this plan (or modify scope — e.g. "frontend can be minimal API-driven first").
2. Set up the repo (git init, remote, CI skeleton if wanted).
3. Assign Phase 0 + 2.1 in parallel.
4. Get real test numbers + good residential proxies ready early (you will need them constantly for testing).
5. Decide on frontend tech definitively (React recommended).

Update this file as tasks complete. Use the environment's todo system for live tracking of the above items.

This plan is designed so sub-agents (or human devs) can pick a task, see exact DoD, and deliver without ambiguity.

Ship it.
