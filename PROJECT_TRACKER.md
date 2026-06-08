# WA Control - Project Tracker

**Project**: wa-control (Rocket WS Cloud Control raw WA multi-account system)

**References**:
- [README.md](README.md)
- [TASKS.md](TASKS.md) (primary implementation plan with phases, tasks, DoD)

**Purpose**: Track progress against TASKS.md. For every significant change/feature, record:
- What was implemented
- Status (e.g., Done, Partial, In Progress)
- Responsible document(s)/file(s) with links (markdown relative paths)
- Notes / links to related code or tests
- Date of entry (approximate based on session)

This document starts with a **retrospective** of what has been achieved so far (synthesized from implementation work against the plan). Going forward, **every change** will be appended here (typically at the bottom under "Change Log" or per-phase updates), including direct links to the source files/documents that implement the functionality.

**Overall Status**: Substantial progress on critical path (0-Setup → 2-WA Core → 3-Ports/Accounts → 4-Warming → 8-Desk + supporting 5/6 Materials/Contacts). Core "raw control + 养号 + 客服台" loops are functional with proxies, realtime, persistence, and avatar warming. Not yet at full PDF parity or production hardening (e.g., no full blasts, group pulls, or extensive E2E testing with real devices).

See [TASKS.md](TASKS.md) for full agent-assignable breakdown, estimates, and parallelization notes.

---

## Retrospective: What Has Been Achieved So Far

### Phase 0: Project Bootstrap & Foundation (Mostly Complete)
- **0.1 Scaffolding, deps, basic run**: npm setup, scripts (dev, migrate, seed), .env.example, folder structure (src/, frontend/, etc.), basic Express + Socket.io + health endpoint.
  - Responsible files: [package.json](package.json), [knexfile.js](knexfile.js), [src/index.js](src/index.js) (initial + ongoing wiring), [.env.example](.env.example)
- **0.2 Database (Knex + Postgres) + migrations/seeds**: knexfile, connection, first migrations (core tables), test DB handling, supervisor seed.
  - Responsible: [knexfile.js](knexfile.js), [src/db/connection.js](src/db/connection.js), [src/db/migrations/001_core_foundation.js](src/db/migrations/001_core_foundation.js), [src/db/seeds/001_supervisor.js](src/db/seeds/001_supervisor.js) (updated multiple times)
- **0.3 Config, logging, error handling, validation**: Zod schema (DB, JWT, REDIS, ENCRYPTION_KEY, etc.), Winston logger (console + structured), errorHandler/notFound/validate middleware.
  - Responsible: [src/config/index.js](src/config/index.js) (Zod + parse), [src/utils/logger.js](src/utils/logger.js), [src/api/middleware/errorHandler.js](src/api/middleware/errorHandler.js), [src/api/middleware/notFound.js](src/api/middleware/notFound.js), [src/api/middleware/validate.js](src/api/middleware/validate.js)
- **0.4 Basic auth**: JWT login/me/agent creation (supervisor), role/perm middleware (authenticate, requireRole, requirePermission with ROLE_PERMISSIONS map + supervisor wildcard), seed permissions + supervisor.
  - Responsible: [src/api/routes/auth.routes.js](src/api/routes/auth.routes.js), [src/api/middleware/auth.js](src/api/middleware/auth.js), [src/db/seeds/001_supervisor.js](src/db/seeds/001_supervisor.js) (permissions + users)
- **0.5 Basic frontend skeleton**: Vite not used (pragmatic single-file HTML/JS SPA instead for speed); login, layout with tabs (Supervisor/CS desks), fetch + Socket.io client, multi-tab ops UI.
  - Responsible: [frontend/public/index.html](frontend/public/index.html) (evolved significantly; includes login, tabs, Socket.io, desk/chat, materials upload, etc.)

**Additional Phase 0 enablers**:
- Middleware mounted + routes protected in [src/index.js](src/index.js)
- Graceful shutdown for sessions/jobs
- Static serving: `/static` (frontend) + later `/uploads` (materials)

### Phase 1: Data Model & Core Domain (Core Tables + Layers Complete)
- **1.1 DB schema**: 001 foundation (users, permissions, proxies, ports, ws_accounts, materials, contacts, audit) + **002** (warming_pools/tasks, diversion_links, blast_*, group_pulls, conversations/messages, exports + indexes + fixes).
  - Responsible: [src/db/migrations/001_core_foundation.js](src/db/migrations/001_core_foundation.js), [src/db/migrations/002_add_domain_tables.js](src/db/migrations/002_add_domain_tables.js)
- **1.2 Data access layer**: Knex helpers for ws_accounts, ports, warming, contacts, messages (CRUD, filters, business queries like "eligible for warming", auto-assign, etc.).
  - Responsible: [src/data/wsAccounts.data.js](src/data/wsAccounts.data.js), [src/data/ports.data.js](src/data/ports.data.js), [src/data/warming.data.js](src/data/warming.data.js), [src/data/contacts.data.js](src/data/contacts.data.js), [src/data/messages.data.js](src/data/messages.data.js)

### Phase 2: WA Core Engine (Heart - Advanced)
- **2.1 SessionManager**: Core (pre-existing + used/extended): Baileys per-account sockets, custom Postgres-backed encrypted auth state (JSONB creds/keys), proxy injection (https-proxy-agent / socks-proxy-agent per config), QR/pairing/connect/disconnect/reconnect with backoff, presence/profile/group helpers (partial), send with delay, events (qr/connected/disconnected/messages.upsert).
  - Responsible: [src/core/sessions/SessionManager.js](src/core/sessions/SessionManager.js) (main), wired in [src/index.js](src/index.js)
- **2.2 Proxy service + health**: Full CRUD + test (fetch via agent), periodic health (success_rate/status updates), assignment validation.
  - Responsible: [src/core/proxies/ProxyService.js](src/core/proxies/ProxyService.js), [src/api/controllers/proxies.controller.js](src/api/controllers/proxies.controller.js), [src/api/routes/proxies.routes.js](src/api/routes/proxies.routes.js)
- **2.3-2.4 Integration + health**: Account <-> live sessions (activate with port/proxy), DB status sync, health_score, auto-reconnect, batch skeleton, monitoring endpoints.
  - Responsible: Shared manager in [src/api/controllers/sessions.controller.js](src/api/controllers/sessions.controller.js) + [src/index.js](src/index.js) (app.set + events), [src/api/routes/sessions.routes.js](src/api/routes/sessions.routes.js) (protected)

### Phase 3: Ports, Accounts, Groups, Warehouse, Import (Substantial)
- **3.1-3.4**: Port purchase/allocation (type normal/fast_warm, dates, usage count), WS account CRUD + "常规六段号" style import (CSV-like), groups, batch ops skeleton, warehouse (move releases port), delete + audit, data migration stub, stats.
  - Responsible: [src/api/controllers/ports.controller.js](src/api/controllers/ports.controller.js) + [src/api/routes/ports.routes.js](src/api/routes/ports.routes.js) (auth), [src/api/controllers/accounts.controller.js](src/api/controllers/accounts.controller.js) + [src/api/routes/accounts.routes.js](src/api/routes/accounts.routes.js), data layers above, port increment/decrement logic.

### Phase 4: Warming System (Key Requirement - Completed)
- **4.1-4.3**: Warming pools/tasks (enter only if offline, modes normal/fast, progress, schedule), BullMQ queues + worker (repeatable steps: ensure session, apply random nick/avatar from materials, self test msg, presence sim, light group presence for fast_warm, vary intensity/volume, ramp progress, **completion to active + graduation profile**, mode-based realistic delays/scheduling, basic safety throttling), monitoring (in-warm/completed counts + per-task pause in UI), pause/resume.
  - Responsible: [src/api/controllers/warming.controller.js](src/api/controllers/warming.controller.js) + [src/api/routes/warming.routes.js](src/api/routes/warming.routes.js) (mode support + initial delay by mode), [src/jobs/queues.js](src/jobs/queues.js), [src/jobs/workers/warming.worker.js](src/jobs/workers/warming.worker.js) (enhanced multi-behavior sim + graduation on complete + mode-aware reschedule), [src/data/warming.data.js](src/data/warming.data.js), [src/index.js](src/index.js) (startup), UI monitoring + actions in [frontend/public/index.html](frontend/public/index.html) (warming tab: summary header, Actions column, pauseWarmingTask)
  - **Notes**: 养号 now includes varied intensity (normal vs 速养), realistic profile + activity + receiving sim. Proper exit to "active" with optional graduation nick per 4.3. **Group pull (拉群) is NOT part of warming** — it is separate Phase 7 (拉群管理 using privileged adds). Monitoring added per 4.3. Reschedule uses demo values (easy to make production hours-long).

### Phase 5: Contacts, Tags, Diversion (Partial + Integrated)
- Contacts full search/import/export + auto-capture/assignment on any message (in/out) to ws_account.
- (Diversion links stubbed in 002 migration; not fully implemented yet.)
  - Responsible: [src/api/controllers/contacts.controller.js](src/api/controllers/contacts.controller.js) + [src/api/routes/contacts.routes.js](src/api/routes/contacts.routes.js), [src/data/contacts.data.js](src/data/contacts.data.js), auto-capture in [src/api/controllers/messages.controller.js](src/api/controllers/messages.controller.js) and [src/index.js](src/index.js) (messages.upsert handler)

### Phase 6: Materials + Blasting (Materials Complete, Blasts Not Yet)
- **6.1 Materials**: Avatars/nicks/messages CRUD. **Full avatar upload**: multer (memory), Sharp resize/optimize (512x512 JPEG), save to uploads/, content=filename. UI file input + FormData + table previews. Warming consumes them.
  - Responsible: [src/api/controllers/materials.controller.js](src/api/controllers/materials.controller.js) (upload + sharp logic + delete cleanup), [src/api/routes/materials.routes.js](src/api/routes/materials.routes.js) (upload.single), [frontend/public/index.html](frontend/public/index.html) (file input, addMaterial FormData, loadMaterials img previews), [src/index.js](src/index.js) (/uploads static), [src/db/seeds/001_supervisor.js](src/db/seeds/001_supervisor.js) (samples), [src/jobs/workers/warming.worker.js](src/jobs/workers/warming.worker.js) (avatar apply)
- Blasts (6.2-6.4): Tables in 002, but no engine/queues/UI yet (next priority candidate).

### Phase 7: Group Tools + Inheritance (Tables Only)
- group_pulls table + basic model in 002. No execution flows yet (拉群, fan inheritance).

### Phase 8: Customer Service Desk (Core + Realtime Functional)
- **8.1-8.5**: Agent auth/roles (via shared), core desk (sessions view, customer list per number, chat thread with history/realtime incoming, filters), send via correct session, persistence, unread/pinned, group chat stub, quick replies stub, export history stub.
  - Responsible: [src/api/controllers/messages.controller.js](src/api/controllers/messages.controller.js) + [src/api/routes/messages.routes.js](src/api/routes/messages.routes.js) (list/send/read), persistence + broadcast in [src/index.js](src/index.js) (messages.upsert listener + io.emit 'wa:message'), [src/data/messages.data.js](src/data/messages.data.js), desk UI/JS in [frontend/public/index.html](frontend/public/index.html) (desk tab, loadDeskConversations/Messages/Contacts, select, deskSend, socket handlers for live append/refresh, contacts panel with filter/click-to-chat + ✓), Socket.io client init.
- Realtime: Rooms/events for QR/connected/disconnected/messages (wired from SessionManager).

### Phase 9-11: Partial / Supporting
- Basic exports/audit tables + logging.
- Frontend polish (realtime, upload, desk integration).
- No full supervisor stats, hardening, Docker, tests, or docs yet (see "Next" below).
- Meta: todo_write tracking, extensive background task cleanup/reporting for test runs.

**Key Cross-Cutting**:
- Realtime/Socket.io: [src/index.js](src/index.js) (io + events), [frontend/public/index.html](frontend/public/index.html) (client + handlers)
- Auth everywhere on management routes.
- DB + data layers as above.
- Frontend as the living desk mock (no separate Vite yet; pragmatic).

---

## Change Log (New Changes Appended Here Going Forward)

**Format for new entries**:
- **Date**: YYYY-MM-DD (session)
- **Change/Feature**: Short desc + link to TASKS.md item if applicable
- **Status**: Done / Partial / etc.
- **Responsible Documents/Files**: Markdown links (e.g. [src/foo.js](src/foo.js), [frontend/public/index.html](frontend/public/index.html))
- **Notes**: What it enables, related tests, open items, links to PRs/commits if any.

### 2026-06-05 (Session - Avatar Upload + Materials Completion + UI + Warming Integration)
- **Change/Feature**: Full avatar upload pipeline for 素材库 (Phase 6.1) + integration with warming (Phase 4) + desk/materials UI updates + /uploads serve. Enables real profile picture mutation during 养号.
  - **Status**: Done (core end-to-end functional; placeholder seed + UI preview)
  - **Responsible Documents/Files**:
    - Backend upload/processing: [src/api/controllers/materials.controller.js](src/api/controllers/materials.controller.js) (multer handling, sharp resize, file save, delete cleanup), [src/api/routes/materials.routes.js](src/api/routes/materials.routes.js) (upload.single middleware)
    - Server wiring + static: [src/index.js](src/index.js) (multer? no - moved to routes; /uploads static serve)
    - UI: [frontend/public/index.html](frontend/public/index.html) (file input in materials tab, addMaterial FormData logic, loadMaterials with <img src="/uploads/..."> previews for avatars, desk contacts integration)
    - Warming consumption: [src/jobs/workers/warming.worker.js](src/jobs/workers/warming.worker.js) (random avatar pick + updateProfile with path)
    - Seed/data: [src/db/seeds/001_supervisor.js](src/db/seeds/001_supervisor.js) (sample avatar row), uploads/ dir + placeholder file
    - Supporting: [src/config/index.js](src/config/index.js) (UPLOAD_DIR), sharp/multer (already in package.json deps)
  - **Notes**: Upload normalizes to 512x512 JPEG. Warming gracefully skips bad paths. UI resets file input. Supports text materials unchanged. Auto-assigns to current account in desk flows via prior contacts capture. See also [src/db/migrations/002_add_domain_tables.js](src/db/migrations/002_add_domain_tables.js) (materials table). Open: real image validation, S3 later, auth on /uploads.

### 2026-06-05 (Session - Move to Next: Blast Engine Foundation)
- **Change/Feature**: Started Phase 6.2 Blast engine foundation. Basic fan blast creation, recipient management, BullMQ processing with per-account daily caps, randomized delays, status updates, pause, unsent export (demo). UI tab for creating/running/viewing blasts. Reuses existing blastQueue.
  - **Status**: Done for foundation (basic fan blast create/run/pause/export + worker + UI tab; cold blasts and advanced targeting pending)
  - **Responsible Documents/Files**:
    - Data layer: [src/data/blasts.data.js](src/data/blasts.data.js) (create/list/update campaigns + recipients, stats)
    - Controller: [src/api/controllers/blasts.controller.js](src/api/controllers/blasts.controller.js) (list/get/createFanBlast, status updates, export)
    - Routes: [src/api/routes/blasts.routes.js](src/api/routes/blasts.routes.js) (protected CRUD for fan blasts)
    - Server: [src/index.js](src/index.js) (mount blasts routes + startBlastWorker + shutdown)
    - Worker + queue: [src/jobs/workers/blast.worker.js](src/jobs/workers/blast.worker.js) (process recipients, daily cap, send via SessionManager, requeue), [src/jobs/queues.js](src/jobs/queues.js) (scheduleBlastJob + blastQueue)
    - UI: [frontend/public/index.html](frontend/public/index.html) (new Blasts tab, create form using accounts, campaign table, pause/export actions, loadBlastAccounts)
  - **Notes**: Creates recipients from contacts for a WS account. Sends via live sessions with delays. Updates campaign/recipient status. Demo auto-starts small blasts. Cold blasts and full target filters pending. See blast tables in [src/db/migrations/002_add_domain_tables.js](src/db/migrations/002_add_domain_tables.js). Permissions stubs already existed in auth middleware/seed.

(Previous changes are captured in the Retrospective above. Future entries will be appended chronologically here.)

### 2026-06 (Current Session - 拉群/Group Pulls 7.1 + Cold Blasts + Desk Polish)
- **Change/Feature**: Implemented core 拉群 (group pull / 7.1) end-to-end foundation + expanded blasts to full cold (爆粉群发) + desk quick replies (8.4) + group message passthrough. Directly addresses previous Open priorities.
  - **Status**: Done (MVP functional: create/execute pulls using live admin sessions, group creation + invite code/link surfacing, add members via privileged number, BullMQ worker for adds; cold blast create + targeting by explicit phone list + same worker path; quick material message insert in CS desk; relaxed group handling in realtime).
  - **Responsible Documents/Files**:
    - SessionManager group primitives: [src/core/sessions/SessionManager.js](src/core/sessions/SessionManager.js) (createGroup, getGroupInviteCode, addParticipantsToGroup, getGroupMetadata, leaveGroup + updated TODO removal)
    - Data: [src/data/groupPulls.data.js](src/data/groupPulls.data.js) (new — list/get/create/update + status helpers + joins for admin phone)
    - Controller + routes: [src/api/controllers/groupPulls.controller.js](src/api/controllers/groupPulls.controller.js) (new — list, createTask, execute (create+invite+schedule), addMembers, status), [src/api/routes/groupPulls.routes.js](src/api/routes/groupPulls.routes.js) (new — GET/POST/PATCH under /group-pulls, supervisor protected for mutating)
    - Queues + worker: [src/jobs/queues.js](src/jobs/queues.js) (scheduleGroupPullJob), [src/jobs/workers/groupPull.worker.js](src/jobs/workers/groupPull.worker.js) (new — processes adds with sessionManager, re-schedules, marks complete)
    - Wiring: [src/index.js](src/index.js) (mount groupPullsRoutes, startGroupPullWorker + shutdown, relaxed @g.us skip + isGroup in wa:message broadcast + updated progress log)
    - Blasts cold: [src/api/controllers/blasts.controller.js](src/api/controllers/blasts.controller.js) (createColdBlast using target_phones + recipients with contact_id=null), [src/api/routes/blasts.routes.js](src/api/routes/blasts.routes.js) (POST /blasts/cold)
    - Frontend: [frontend/public/index.html](frontend/public/index.html) (nav + full #tab-laqun with admin select / subject / targets form, execute, add-members, invite display; blasts tab now has type toggle + cold phones input + unified createBlast dispatcher; desk compose now has quick-reply <select> + Insert button wired to /materials message templates + loadQuickReplies; live wa:message handler supports [G] prefix for groups)
    - Supporting: groupPullQueue already existed in queues; permissions seed had 'groups.pull'; schema in [src/db/migrations/002_add_domain_tables.js](src/db/migrations/002_add_domain_tables.js)
  - **Notes**: Execution uses real Baileys group* calls on a live privileged (scanned) admin number. Invite QR/link surfaced immediately for manual join or further adds. Cold blasts reuse the blast engine + daily cap safety (no opt-in requirement). Quick replies pull message materials and insert into compose (user can edit before send). Group messages now flow to persistence + live events (conversation key = full group JID). Demo pacing (like warming) — production would use longer delays / cron. Open follow-ups: full group chat in desk (8.3), per-recipient tracking for pulls, better cold pool storage, real device validation of adds (admin rights required on the WA side).
- Blast foundation note updated in place (cold now implemented).

---

## Open / Next Priorities (from TASKS.md Critical Path + User Direction)

- 拉群 full (7.1 complete for basic; enhance with member tracking, QR display in UI, bulk from contact lists).
- Desk group chat + revoke + 通讯录 pull (8.3) now easier with group message passthrough.
- Blast polish (stats, better cold targeting from a stored pool, UI for unsent export as real file).
- Warming exit/graduation + monitoring dashboard (4.3).
- History export central (8.5 / 9.2).
- Real multi-day testing with proxies + owned numbers (11.x).
- See [TASKS.md](TASKS.md#parallelization-notes--critical-path) for ASAP path.

**Current next step recommendation**: Use the new proxy scraper (`npm run scrape-proxies`) with `--test` to populate test proxies, then exercise 拉群 + cold blast + desk flows. After that, focus on real device validation or blast polish. Update tracker after each significant change.

Update this tracker on every change. Use `search_replace` or append to keep it current.

**Last Updated**: 2026-06 (Waydroid provisioning controller + cloud_emulators table + metadata storage). See Change Log.

### 2026-06 (Proxy Scraper for Testing)
- **Change/Feature**: Added GitHub-based free proxy scraper tool. Pulls from popular public lists (TheSpeedX/PROXY-List, monosans/proxy-list, jetkai/proxy-list, etc.). Supports HTTP and SOCKS5. Deduplicates, limits results, optional testing via existing ProxyService, and direct addition to DB. Includes --dry-run and CLI flags.
  - **Status**: Done
  - **Responsible Documents/Files**:
    - Main script: [src/scripts/proxy-scraper.js](src/scripts/proxy-scraper.js)
    - npm script: [package.json](package.json) (`"scrape-proxies"`)
  - **Notes**: 
    - Run examples: `npm run scrape-proxies -- --type socks5 --limit 50 --test` or `--dry-run`
    - Intended **only for development/testing** the proxy system (health checker, injection, UI, etc.).
    - Free proxies are low-quality and should **never** be used with real WhatsApp accounts or production warming/blasts.
    - Reuses existing ProxyService.createProxy + .testProxy logic for consistency.
    - Recommended: After scraping, use the built-in proxy health checker regularly.

### 2026-06 (Phone-less / Cloud WhatsApp Registration Support)
- **Change/Feature**: Added full support for phone-less / cloud-only WhatsApp operation using Baileys pairing code flow (instead of QR scan). This enables registering numbers in cloud Android emulators (Waydroid, Android-x86, etc.), linking them programmatically or semi-automatically, persisting the session, and then shutting down the emulator completely.
  - **Status**: Done (core backend + UI + documentation)
  - **Responsible Documents/Files**:
    - Core pairing support: [src/core/sessions/SessionManager.js](src/core/sessions/SessionManager.js) (new `requestPairingCode` method + event)
    - API flow: [src/api/controllers/sessions.controller.js](src/api/controllers/sessions.controller.js) (branch for `usePairingCode` / `phone_assoc`)
    - Routes + docs: [src/api/routes/sessions.routes.js](src/api/routes/sessions.routes.js)
    - Realtime: [src/index.js](src/index.js) (emit `wa:pairing_code`)
    - Frontend UI: [frontend/public/index.html](frontend/public/index.html) (new "Connect (Cloud/Pairing)" button, pairing code display in qr-area, socket handler for `wa:pairing_code`)
    - Full guide: [docs/CLOUD_PHONELESS.md](docs/CLOUD_PHONELESS.md) (architecture, step-by-step emulator setup, automation ideas, risks)
  - **Notes**: 
    - Use `POST /sessions/connect` with `{ "usePairingCode": true, "acquisitionMethod": "phone_assoc" }` or the new UI button.
    - Returns an 8-digit code to enter inside the WhatsApp app running in your cloud emulator (no phone camera / QR scan needed).
    - After successful link, auth state is saved encrypted in DB — emulator can be terminated.
    - This is the practical path for "completely phone-less" operation while staying within the raw Baileys linked-device model.
    - See the new detailed doc for recommended stacks (Waydroid/Android-x86 on VPS), virtual number providers, risks, and automation ideas.
    - Complements existing `acquisition_method` enum and proxy-per-account model.

### 2026-06 (Waydroid Provisioning Controller + Emulator Metadata Storage)
- **Change/Feature**: Added proper storage for cloud emulator / device metadata and a provisioning controller/service for Waydroid (and extensible to other Android environments). Addresses the user's need for a "controller that provisions the Waydroid instance".
  - **Status**: Done
  - **Responsible Documents/Files**:
    - New DB schema: [src/db/migrations/003_cloud_emulators.js](src/db/migrations/003_cloud_emulators.js) (cloud_emulators table with ws_account_id, provider, status, metadata JSONB, host, session_name, etc.)
    - Core service: [src/cloud/emulator.service.js](src/cloud/emulator.service.js) (EmulatorService with create, startWaydroidSession, installWhatsApp, linkWithPairingCode, shutdown, full provisionAndLink flow, shelling out to `waydroid` commands)
    - API controller: [src/api/controllers/cloud.controller.js](src/api/controllers/cloud.controller.js) (list, get, provision, start/stop/link/shutdown endpoints)
    - Routes: [src/api/routes/cloud.routes.js](src/api/routes/cloud.routes.js) (mounted under /api/v1/cloud/emulators)
    - Server mount: [src/index.js](src/index.js)
    - UI hooks: [frontend/public/index.html](frontend/public/index.html) ("Cloud Provision" button per account + listEmulators() helper)
  - **Notes**:
    - The service is designed to be called from API or from external scripts/automation.
    - It integrates directly with the pairing code flow added earlier.
    - Addresses the Wayland error the user saw by providing comments and env handling for headless (Xvfb) operation.
    - Run `npm run migrate` to apply the new table.
    - Example usage: POST /api/v1/cloud/emulators/provision with { "ws_account_id": "..." }
    - Still requires the host to have Waydroid properly installed and (for headless) a virtual display setup. The controller is the orchestration layer on top.
    - CLI helper: `npm run provision-waydroid -- --account <ws_account_id>` (see src/scripts/provision-waydroid.js)
    - New table + service also improve metadata storage for future automation and auditing.

### 2026-06 (CSP, DevTools, and Warming Job Stability Fixes)
- **Change/Feature**: Fixed browser CSP errors blocking inline event handlers in the static UI (onclick, onchange, etc. used throughout the desk and other tabs). Silenced noisy Chrome DevTools `/.well-known/appspecific/com.chrome.devtools.json` 404 spam. Made warming BullMQ jobs more resilient to "job stalled more than allowable limit" errors (common during long simulation steps or dev restarts).
  - **Status**: Done
  - **Responsible Documents/Files**:
    - Helmet CSP configuration: [src/index.js](src/index.js) (relaxed `script-src-attr` and related directives)
    - DevTools silence route + static: [src/index.js](src/index.js)
    - Warming job robustness: [src/jobs/queues.js](src/jobs/queues.js) (added `lockDuration`), [src/jobs/workers/warming.worker.js](src/jobs/workers/warming.worker.js) (increased `stalledInterval`/`maxStalledCount`, added `job.updateProgress()` calls for liveness)
  - **Notes**: The frontend is a pragmatic single-file HTML/JS app with many inline handlers, so we allow `'unsafe-inline'` for `script-src-attr` (and relaxed script/style for dev ergonomics). Warming worker now signals progress during heavy steps (profile updates, sends) and uses more forgiving stall settings. Chrome probe route returns an empty object to stop morgan from logging 404s. These are dev/QoL fixes; production CSP should be tightened if a proper frontend is built. All changes tracked per project guidelines.