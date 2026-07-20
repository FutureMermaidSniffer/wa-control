# wa-control System Architecture Breakdown

## Overview
wa-control is a backend system for managing multiple WhatsApp accounts using Baileys (multi-device library). It supports cloud phone-less registration via Waydroid emulators, per-account proxies, and a CS desk for agents. The frontend (simple HTML/JS) provides the "newchat" desk view.

The system separates **primary registration** (official WA in emulator or phone) from **companion linking** (Baileys session managed by server).

### Two-layer model (SessionEngine vs Ops)

```
OPS / CONTROL PLANE
  ports · warehouse · warming · blasts · group pull · materials · desks · MoreLogin
            │
            ▼  narrow interface only
SESSION ENGINE  (src/core/engine/SessionEngine.js → SessionManager)
  multi-session Baileys · QR + pairing · proxy · auth state · send/receive events
```

- **Engine** (OpenWA-like simplicity): `startLink({ mode: 'qr'|'pairing' })`, `GET /sessions/:id/qr`, Socket.io `wa:qr` / `wa:pairing_code` / `wa:connected`.
- **Ops** (Rocket product): port allocation on link success, auto-warm, blast/group workers, CS desk — never implement reconnect/QR themselves.
- Workers and cloud services call `getSessionEngine()` (shared instance from `src/index.js`), not `new SessionManager()`.

## Components and Interactions

Use this Mermaid diagram for visual breakdown (copy to Mermaid live editor):

```mermaid
graph TD
    subgraph External
        NP[Number Providers<br/>Grizzly, Hero, Manual, SMS-Activate etc.<br/>Get number + SMS code]
        PP[Primary Phone/Emulator<br/>Official WhatsApp app<br/>Register with SMS, set name]
    end

    subgraph Server Backend
        CES[Cloud Emulator Service<br/>Now MoreLogin outsourced (OpenAPI): create/power/install/reg on remote Android<br/>Legacy Waydroid kept for transition]
        DB[(Postgres DB<br/>ws_accounts: phone, status primary_registered/linking/linked/offline, proxy_id, baileys_auth_state encrypted<br/>cloud_emulators, proxies, ports)]
        PS[Proxy Service<br/>SOCKS5/HTTP agents, health checks]
        SM[Session Manager<br/>Baileys: makeWASocket with proxy, requestPairingCode, companion_hello, MACOS UA patch, fresh state reset]
        API[API Layer<br/>Express + auth: /sessions/connect usePairingCode/forceDirect, /cloud/mark, allocation]
        Jobs[Jobs/Workers<br/>BullMQ: blasts, warming, group pulls]
    end

    subgraph Frontend / Desk
        FD[CS Desk /newchat<br/>getAccountList, friends/list by csUsername, chatLogList, sendMsg]
        SD[Supervisor Desk<br/>accounts, ports, materials, proxies]
        RT[Realtime Socket.io<br/>QR, connected, wa:message, pairing_code]
    end

    NP -->|acquire number + code| CES
    CES -->|create/update records| DB
    CES <-->|provision, start, install, register| PP
    API -->|mark primary_registered| DB
    API -->|request link / pairing code| SM
    SM -->|inject per-account proxy| PS
    PS -->|socks5 or http agent| SM
    SM <-->|WebSocket + pairing| PP
    SM -->|save auth state, update status to linked, pull display_name| DB
    SM -->|events for messages/presence| RT
    API <-->|desk data, send, lists| FD
    RT <-->|live updates| FD
    Jobs -->|use sessions for sends| SM
    API <-->|manage| SD

    classDef challenge fill:#ffcccc,stroke:#ff0000
    class NP,PP,SM,PS,API challenge
```

### Detailed Component Breakdown

**1. Number Providers (External)**
- GrizzlySMS, Hero, Manual, etc.
- Get virtual number + receive SMS verification code via their API/dashboard.
- **Interaction**: Used in cloud.controller.js for acquire, getSmsCode, setStatus.
- No direct WA registration here.

**2. Cloud Emulator Service (src/cloud/emulator.service.js)**
- Provisions Waydroid containers for primary WA registration.
- Start session, install APK, user enters number + SMS code inside emulator.
- linkWithPairingCode: creates minimal ws_account if needed, calls SessionManager.
- Supports linkOnly for pre-registered cases.
- **Interaction**: Called by provision-waydroid.js and API. Updates cloud_emulators and links to ws_accounts.
- For phone primary: bypassed via --mark-registered.

**3. Database (Knex/Postgres)**
- Tables: ws_accounts (core: phone, status, proxy_id, baileys_auth_state JSONB encrypted, display_name, acquisition_method), cloud_emulators, proxies, ports, etc.
- Status flow: pending_verification -> primary_registered -> linking -> linked/active. Can go offline on close.
- Encrypted auth state (creds + keys) for Baileys.
- **Interaction**: Queried/updated by all services/controllers. Source of truth for state.

**4. Proxy Service & Injection (src/core/proxies/ProxyService.js, SessionManager)**
- Manage SOCKS5/HTTP proxies per account.
- In socket creation: use SocksProxyAgent or HttpsProxyAgent.
- **Interaction**: Assigned to ws_accounts.proxy_id. Injected at socket creation time (critical for pairing and runtime).
- Challenges: Many residential proxies reject WA WebSocket (especially companion_hello).

**5. Session Manager (src/core/sessions/SessionManager.js)**
- Core: Uses @whiskeysockets/baileys makeWASocket.
- Custom DB auth state (encrypted).
- requestPairingCode: waits for socket ready, calls sock.requestPairingCode, handles companion_hello.
- Patches: MACOS UA/platform to avoid 405, force fresh state, settle time.
- Proxy per socket.
- Events: pairing_code, qr, connected, disconnected, messages.
- **Interaction**: Called by API for linking. Runs the companion session headless after link. Uses proxies. Updates DB status.
- On success: port allocated, display_name from primary.

**6. API Layer (src/api/controllers/sessions.controller.js, cloud.controller.js etc.)**
- /sessions/connect: supports usePairingCode, forceDirect (bypass proxy for test), proxyId.
- /cloud/.../mark-registered: for phone or emulator.
- Creates/updates accounts, handles forceNew, sets status.
- **Interaction**: Entry point from frontend/script. Calls SessionManager and EmulatorService. Enforces status guards (relaxed for phone vs emulator).

**7. Frontend / Desk (frontend/public/index.html, realtime)**
- CS Desk (newchat): getCsList, getAccountList (via chat?), friends/list by csUsername, chatLogList, sendMsg via API.
- Shows accounts, fans, chat window.
- Realtime via Socket.io for updates/QR.
- **Interaction**: Polls/calls API, receives events from SessionManager.

**8. Other (Jobs, Materials, etc.)**
- BullMQ workers for scheduled blasts/warming/groups using live sessions.
- Materials for avatars/nicks/messages (used in warming and desk).
- Ports for capacity tracking.

## Challenges Faced So Far (from runs and logs)

- **Proxy / Network Issues**:
  - SOCKS5 proxies (e.g. proxy-us.proxy-cheap res pools) reject WA WebSocket immediately ("WebSocket Error ()", "Socks5 proxy rejected connection - NotAllowed").
  - Even "good" for general use, fail during pairing (companion_hello stage).
  - Direct sometimes works, proxy blocks the tunnel.

- **No Phone Notification / Failed Handshake**:
  - Baileys companion_hello rejected by server (no push to primary phone).
  - Real web.whatsapp.com succeeds and pings phone.
  - Causes: bad client fingerprint (UA/platform), proxy, timing, stale state.
  - Multiple socket retries, "waitForSocketOpen failed", "Connection Closed", "Connection Failure".

- **Status Machine Problems**:
  - Accounts go to 'offline' on close.
  - Guard "is not primary_registered (status=offline)" blocks re-linking.
  - Distinguishing phone primary (mark-registered, no emulator needed) vs emulator primary (full provision).
  - Test number sim fakes primary_registered without real WA.

- **Client Identification**:
  - Needed MACOS UA patch + browser string to bypass 405/platform rejections.
  - Still not always triggering phone prompt.

- **Simulation vs Real**:
  - Test number allows DB/provision test without device, but Baileys attempt is pointless without real primary.
  - Hard to isolate: is problem in socket creation, hello, proxy, or server-side acceptance?

- **Script / Flow Issues**:
  - --link-only with phone still reuses emulator records.
  - Status not always updated correctly for phone case.
  - Loud logs, missing clear "phone primary" path.
  - forceDirect helps bypass proxy but needs to be easy to use.

- **Other**:
  - Auth state encryption, fresh creds for each attempt.
  - Timing: need socket ready before requestPairingCode + settle wait.
  - No easy differentiation of phone vs emulator primaries in all paths.
  - For real phone primary: user registers on phone, but system may still expect emulator.

These lead to the symptom: system fails to link where real web succeeds, no notification, repeated closes.

## How to Test Other Sections to Pinpoint the Exact Source

Break the end-to-end flow into **isolated, testable stages**. Use the test number for early stages, a real number (with real primary on phone) for later. Use --direct / forceDirect, API calls, DB queries, and verbose logs to isolate.

Use this staged testing plan (add to your testing docs or run manually):

### Stage 1: Number Acquisition & Record Creation (no WA involved)
- Use any provider (Grizzly API, manual, etc.) or just insert directly.
- Command: `node src/scripts/provision-waydroid.js --phone +19402245391 --link-only` (or API equivalent).
- **What to check**:
  - cloud_emulators record created/updated (phone, status).
  - ws_accounts created with phone, acquisition_method.
- **Pinpoint**: If fails here -> DB/provider integration. Run with different numbers/providers.
- **Tool**: Inspect DB: `SELECT * FROM cloud_emulators, ws_accounts WHERE phone = '+19402245391';`
- **Isolate**: Use --mark-registered to simulate without provider.

### Stage 2: Primary Registration (on real device)
- On your **phone** (or full Waydroid without --link-only):
  - Install official WhatsApp.
  - Enter number.
  - Get SMS code from provider site (not API only - manual dashboard is fine).
  - Verify in WA, set name/profile.
- **What to check**:
  - WA shows registered, name set, can see "Linked Devices".
- **Pinpoint**: If no SMS or can't verify -> provider or phone/WA side. Confirm with real web.whatsapp.com test.
- **For sim test number**: Fake it with --mark-registered (no real WA).

### Stage 3: Mark Primary Registered
- Run: `node src/scripts/provision-waydroid.js --phone +19402245391 --mark-registered`
- Or API if exposed.
- **What to check**:
  - ws_accounts.status = 'primary_registered' (not offline/pending).
  - (Optional) emulator status if using cloud record.
- **Pinpoint**: If status wrong -> mark logic or race with close handlers. DB query before/after.
- **Note**: This is the key differentiator for phone vs emulator primaries. Mark after phone reg.

### Stage 4: Baileys Socket Creation & Connect (independent of WA primary)
- Use --direct or forceDirect: true.
- Command: `node src/scripts/provision-waydroid.js --phone +19402245391 --link-only --direct`
- Or API: POST /sessions/connect {phone, usePairingCode: true, forceDirect: true, forceNew: true}
- **What to check** (critical logs):
  - "[PAIRING] Creating Baileys socket ... DIRECT (no proxy)"
  - "[PAIRING] Socket open succeeded"
  - No "WebSocket Error ()" or immediate close.
  - Proxy cleared (if forceDirect).
- **Pinpoint**:
  - Fails at open -> proxy/network/tunnel (test proxy separately with curl --socks5 ... web.whatsapp.com).
  - Succeeds open but later fails -> client ID or timing.
- **Isolate**: Run a minimal Baileys test script just for socket connect (no pairing). Try with/without the proxy assigned to account. Use residential IP if possible.
- **Tool**: Tail logs for [PAIRING-TRANSPORT], [PAIRING-DEBUG]. DB: check proxy_id before/after.

### Stage 5: Pairing Code Request & companion_hello
- After socket open succeeds.
- **What to check**:
  - Code generated and printed with banner.
  - "[PAIRING] client-side code generated + companion_hello IQ sent"
  - No "Connection Failure" right after.
  - QR may appear temporarily but code takes precedence.
- **Pinpoint**:
  - Hello sent but no effect -> server rejected (fingerprint, UA, platform).
  - Code never generated -> socket not ready.
- **Isolate**: Use forceNew: true. Check exact lastDisconnect statusCode. Compare direct vs proxy. The MACOS patch should be active.
- **Test**: Call API multiple times with forceDirect. Observe if phone (with real primary) gets prompt.

### Stage 6: Code Entry & Full Link Success (needs real primary)
- On phone (with number registered): Linked Devices -> enter code.
- **What to check**:
  - Phone gets notification/prompt (the original problem).
  - System: connection 'open', status -> 'linked', display_name updated from primary, port allocated.
  - No more closes.
  - Can send/receive.
- **Pinpoint**:
  - No notification but code accepted on phone -> partial success.
  - Notification but link fails on server -> client ID issue.
  - Success only with --direct -> proxy problem for handshake.
- **Tool**: On phone side, watch for prompt. System logs for 'open' and profile. DB after.

### Stage 7: Post-Link & Runtime
- Reconnects, messages via API/desk, proxy usage at runtime (not just linking).
- Warming/blasts using the session.
- **Pinpoint**: If links but messages fail -> runtime proxy or other.

### General Testing Tips to Pinpoint
- **Always use --direct / forceDirect first** for linking tests to isolate proxy.
- **Use the test number (+13185167435) for stages 1-4** (no real primary needed).
- **Use a real number + phone primary for stages 5-6** (to check notification).
- **Log everything**: Enable verbose, grep for [PAIRING], connection.update, lastDisconnect, statusCode.
- **DB inspection** at each stage (statuses, proxy_id, auth_state).
- **Independent tests**:
  - Minimal node script for Baileys socket + proxy only (test stage 4 without full provision).
  - Curl the API directly (bypass script).
  - Test proxy health: curl -v --socks5-hostname ... https://web.whatsapp.com
  - Real web.whatsapp.com comparison (open in browser, link, see if prompt appears).
- **Force fresh**: Always use forceNew: true.
- **Reset state**: Delete/recreate ws_account or clear baileys_auth_state for clean tests.
- **Differentiate phone vs emulator**:
  - Phone primary: user does reg on phone -> --mark-registered (no emulator start) -> link.
  - Emulator primary: full provision (no --link-only) -> register inside Waydroid -> link (or --link-only if pre-registered).
  - Use --mark-registered for phone case; the system should not require emulator record/status for it.
- **If socket fails at open**: Network/proxy.
- **If opens but no code/no prompt**: Client ID (UA/patch), timing, or server rejection.
- **Reproduce original symptom**: Use real primary on phone + system link (with/without --direct) vs real web.whatsapp.com.

Run the simulation first to validate our code, then switch to a real number on your phone for the critical handshake test. Share full logs from a failing real attempt (with --direct) and we can target the exact stage.

This staged approach avoids circles and pinpoints (e.g., if stage 4 fails with direct, it's not our proxy code; if stage 6 fails notification, focus on client fingerprint).
