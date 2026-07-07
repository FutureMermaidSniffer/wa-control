# MoreLogin Cloud Phone Integration Plan (Full Rewrite for Outsourced Cloud Emulator)

**Status**: Active implementation  
**Date**: 2026-06-27  
**Branch**: vmos (or new feature branch for this work)  
**Goal**: Completely replace local Waydroid/system emulator with MoreLogin Cloud Phones (Local API + Open API). Use fully separate registration sequence.

## Key Decisions (Approved by user)

- **No more system phone emulator** (Waydroid, provision-waydroid etc. are legacy/fallback).
- **Separate registration sequence**:
  1. Get number + WhatsApp SMS code from supplier (Grizzly/hero/manual etc.).
  2. Register the number **on the MoreLogin cloud phone** (install WA, enter phone+code).
  3. After primary registration confirmed → request Baileys pairing code → link companion.
  4. Power off / cleanup cloud phone (save cost).
  5. Proceed to warming + agent work (Baileys sessions only).
- Full agent permission: rewrite aggressively, add tests at each step, no holding back.
- Use both APIs where sensible:
  - Open API (`https://api.morelogin.com`, OAuth2) for server/remote control.
  - Local API (`http://127.0.0.1:40000`) for when MoreLogin desktop client is co-located (simpler auth).
- Credentials provided (use via env):
  - Local: http://127.0.0.1:40000
  - Open: ID=1711657534265251 , Key=d1d5ac34f66a43a4b483f647fad0cb65

## What MoreLogin Gives Us (API capabilities relevant here)

From https://guide.morelogin.com/ + examples + SDK:

**Auth**
- Open: POST /oauth2/token → Bearer access_token (1h, auto refresh 60s early).
- Local: optional Authorization header.

**Device Lifecycle (Open paths /cloudphone/... ; Local /api/cloudphone/... )**
- POST /cloudphone/create (skuId e.g. 10004=Android15, quantity, country, timezone, proxyId, brand/modelId, envRemark, lat/long etc.)
- POST /cloudphone/page (list)
- POST /cloudphone/info , /queryByAndroidId
- POST /cloudphone/powerOn (id or ids), powerOff
- POST /cloudphone/newMachine (fingerprint reset)
- Wait for envStatus === 4 (powered on / ready)
- Delete / reset later if exposed.

**App**
- POST /cloudphone/app/page (discover available apps + versions in library)
- POST /cloudphone/app/install {id, packageName, versionCode}
- /app/start, /app/stop, /app/uninstall, /app/installedList
- /app/openRoot , setHideAccessibilityApp

**Automation / Control**
- POST /cloudphone/enableAdb → returns host/port or SSH info
- POST /cloudphone/exeCommand {id, command} → "input text xxx", "am start -n ...", "wm size", pm etc.
- Touch: /cloudphone/touch/click {id, pos:[x,y]}, swipe, drag
- Screenshot: /cloudphone/screenCap , /screenCapBase64 (for debug/vision loops)
- RPA schedules (future)

**Files**
- uploadUrl + PUT + uploadFile ; download flows

**Proxy**
- /cloudphone/setProxy on boot or later (supports our proxies)
- Can assign proxyId at powerOn or create time.

**Billing note**: Devices are metered (duration/unit in some flows). Always powerOff promptly after primary registration + link code issued. Use smallest sku that works.

## New Registration Flow (Phone-less, Supplier-first)

```
1. Supplier
   POST /cloud/numbers/acquire {provider:'grizzly', country:..., service:'wa'}
   → phone, orderId  (cloud_emulators row created with phone only, status=provisioning)
   Poll /cloud/numbers/:id/status repeatedly until SMS code arrives (getSmsCode)

2. Separate Cloud Registration (NEW)
   POST /cloud/phones/create-for-reg {phone or emulator_id}
     - Create MoreLogin cloud phone (choose skuId=Android 14/15, optional proxy from our pool, geo)
     - Power on + waitUntilReady (envStatus=4)
     - Discover WhatsApp in app catalog → installApp(com.whatsapp, latestVersionCode)
     - Start WhatsApp
     - (Auto or assisted) enter phone number + country
     - Submit the SMS code from supplier
     - Confirm success (e.g. chats visible or package state or screenshot analysis)
   → cloud_emulators: morelogin_id=..., status='registered', metadata detailed

   Helpers (for automation / UI control):
   - POST /cloud/phones/:mlId/click , /input , /exe , /screenshot
   - High-level: POST /cloud/phones/:id/register-number {phone, code}

3. Mark + Link (existing Baileys, unchanged core)
   markNumberRegistered (or automatic after reg confirm)
   → ws_accounts.status = 'primary_registered' (create minimal if phone-first)
   POST /cloud/emulators/:id/link  (or /sessions/connect with pairing)
     - SessionManager.requestPairingCode
     - Operator (or future automation) enters code **in the cloud phone WhatsApp "Link a device"**
   → On Baileys 'open' → full ws_account + port allocation + proxy + linked status

4. Cleanup
   Power off cloud phone immediately (or schedule short keep-alive).
   Optional: delete or keep for re-warm/re-link later (newMachine on reuse).
   Emulator record kept for audit (status stopped/released).

5. Proceed
   Warming jobs, blasts, desk agents all use the Baileys companion session only.
   No emulator required after link.
```

This decouples "primary device lifetime" from "account lifetime".

## Implementation Phases + Test Gates (Test at Every Step)

**Phase 0 (done in chat)**: API research + codebase audit.

**Phase 1: Foundation + Client (testable immediately)**
- [ ] Add env + config.
- [ ] Implement `src/cloud/morelogin.client.js` (pure API client, token mgmt, error handling following {code, msg, data}).
- **Test gate**: `node src/scripts/test-morelogin-client.js --action=list` (safe, read-only). Verify token, list devices. Add --live-create flag for later.

**Phase 2: High-level Service + Records**
- [ ] `src/cloud/morelogin.service.js` (or extend EmulatorService with strategy).
- Keep `cloud_emulators` table as the source of truth (add `morelogin_id` column).
- Methods mirror old: createRecord(phone), provisionForRegistration, installWhatsApp, etc.
- **Test gate**: Unit tests or script that creates emulator record only (DB), no live ML calls. Then live "dry" list+info.

**Phase 3: Separate Registration Endpoints + Automation Layer**
- [ ] New controller methods + routes: createCloudPhone, power, install, registerFlow, click/input helpers, confirmReg, cleanup.
- [ ] Implement registration script using exeCommand + touch + polling.
  - Example sequence for reg:
    1. am start -n com.whatsapp/.Main
    2. Wait, screenshot
    3. Calculate/ hardcode first taps (or use vision later)
    4. input text +<phone>
    5. tap next
    6. input code
    7. Done.
- **Test gate**: Live test using a cheap/test number: acquire → get code → full create+install → (manual or scripted entry) → mark. Verify emulator record updated with morelogin_id + status=registered. Then link test.

**Phase 4: Lifecycle, Proxy, Cost, UI, CLI**
- Proxy assignment (set at create or powerOn or post).
- Always power off after link code issued.
- Update provision script + frontend.
- **Test gate**: End-to-end on one number (no production traffic). Confirm after link: cloud phone can be powered off, Baileys session still works, warming can run.

**Phase 5: Polish + Docs + Deprecate**
- Migration for schema.
- Update CLOUD_PHONELESS.md, system-architecture.md, testing-plan.md.
- Add health / list phones from ML in supervisor views.
- Feature flag or provider switch in EmulatorService if transitional.
- **Test gate**: Run full flow 2-3 times. Check billing impact small. Existing linked accounts unaffected.

## Files to Touch / Create (aggressive rewrite OK)

New:
- `src/cloud/morelogin.client.js`
- `src/cloud/morelogin.service.js`
- `src/scripts/test-morelogin-client.js`
- `src/scripts/provision-morelogin.js` (or major update to existing)
- `docs/MORELOGIN_INTEGRATION_PLAN.md` (this)
- (maybe) `src/integrations/morelogin.js` if shared

Modify heavily:
- `src/cloud/emulator.service.js` → deprecate Waydroid, or make it a legacy adapter.
- `src/api/controllers/cloud.controller.js`
- `src/api/routes/cloud.routes.js`
- `src/config/index.js`
- `frontend/public/index.html` (emulator UI)
- `knexfile + new migration 007_morelogin_cloud_ids.js`
- `src/db/migrations/...`
- `package.json` scripts (test-*, provision-ml)
- Docs: CLOUD_PHONELESS, architecture, TASKS.md etc.

Legacy keep (for transition):
- Waydroid methods still callable via old routes until we rip out.
- Or add `provider: 'morelogin' | 'waydroid'` switch.

## Risk / Gotchas

- WhatsApp app version discovery: must query /app/page first for current WhatsApp versionCode. Hardcode common ones initially.
- Touch coords / flow fragility: different Android skus + WA versions. Use screenshot feedback + exeCommand (more reliable than pure coords).
- Proxy on cloud phone: either assign our residential via setProxy (if we first create proxy record in ML) or use direct + our own per-account proxies on Baileys side only.
- Billing: powerOff always. Consider using short-lived instances or "newMachine" on reuse instead of delete/create.
- Auth token lifetime: client must refresh proactively.
- Rate limits: 120/min — batch, backoff.
- envStatus values: 2=off, 4=ready, 7=resetting etc. (poll).
- For registration, the "primary" device fingerprint stays with the cloud phone instance used at signup time. That's desired for consistency.
- Local vs Open: make client support mode switch via config `MORELOGIN_MODE=local|open`.

## Testing Strategy (enforced)

- Every new method in client has a corresponding test invocation in the test script (list, info, create if flag, power if flag, etc.).
- Scripts always default to **safe read** or `--confirm` / `--live` for mutating.
- DB-only tests (create record) runnable without creds.
- Full flow test uses the special test number where possible, or a single cheap real number.
- After link success verify: 
  - emulator status
  - ws_account linked
  - port allocated
  - can send via desk or warming worker
  - phone powered off in ML

## Implementation Status (2026-06-27)

**Core complete and tested live:**
- ✅ Config + env
- ✅ `src/cloud/morelogin.client.js` (full methods, token refresh, local+open) — live list/info/findWA/screenshot/power calls succeeded
- ✅ `src/cloud/morelogin.service.js` (high level + separate reg flow, record mgmt, automation helpers)
- ✅ Migration 007 + DB columns
- ✅ Controller + routes for new endpoints (`/cloud/morelogin/*`)
- ✅ Test scripts + `provision-morelogin.js`
- ✅ Frontend hints
- ✅ Live verification commands pass
- ✅ Power-off discipline + WA catalog discovery working (`com.whatsapp` v262408020 on sku 10004)

**Test commands (run these now):**

```bash
# 1. Basic connectivity + inventory
node src/scripts/test-morelogin-client.js --action=list
node src/scripts/test-morelogin-client.js --action=find-whatsapp
node src/scripts/test-morelogin-service.js --action=list

# 2. Full separate registration (you must have number + real SMS code from supplier first)
npm run provision-morelogin -- --phone +1555... --code 123456 --link --power-off

# Or step-by-step via API (after auth):
# POST /cloud/numbers/acquire
# GET  /cloud/numbers/:emuId/status   (to get code)
# POST /cloud/morelogin/create-for-reg   {phone}
# POST /cloud/morelogin/register         {phone, code}
# POST /cloud/morelogin/:id/action       (for manual taps/inputs if auto insufficient)
# POST /cloud/morelogin/:id/link
# POST /cloud/morelogin/:id/power-off     <--- always do this
```

**Next (remaining polish):**
- Full E2E with a real cheap number from Grizzly (you drive).
- Add proxy registration in ML if you want ML to originate from your proxies.
- Add delete/newMachine endpoints.
- Update more docs + deprecate Waydroid paths.
- Optional: vision-assisted reg using screenshots.

All core wiring done. The system now uses outsourced MoreLogin for cloud phone emulator. The registration sequence is fully separate as requested.


User instruction followed: "start with creating a clear path and to do list. find ways to test at each implementation."

Let's build.
