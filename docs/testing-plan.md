# Testing Plan: From Simulation to Real Primary WhatsApp (No Grizzly Dependency)

## Goals
- Test the full onboarding flow for a real number with a real primary WhatsApp.
- Verify that our system correctly handles:
  - Primary registration (done outside the system, on phone or Waydroid).
  - Marking the account as `primary_registered`.
  - Requesting a pairing code.
  - The phone receiving the linking notification.
  - Successful Baileys companion link (status `linked`, display_name pulled from primary, port allocated).
  - Proxy at linking time, forceDirect for testing, fresh state, realistic client ID (headers/UA/platform).
- Support any number provider or manual acquisition (Grizzly, HeroSMS, 5SIM, SMS-Activate, custom, etc.).
- The SMS provider is only for getting the number and verification code. Registration always happens in the official WhatsApp app (on phone or emulator). Linking happens via our Baileys-based system.

**Important**: Baileys never registers a number. It only links as a companion to an already-registered primary WhatsApp. You must complete registration (SMS verification + profile) on the primary device first.

## Current State (from tests with +13185167435)
- Simulation mode (`--phone +13185167435 --link-only`) creates:
  - `cloud_emulators` record (status `registered`).
  - `ws_accounts` record (status `primary_registered`, fake display name).
- No real WhatsApp is installed or run (by design).
- The script may still trigger a Baileys socket + pairing code request for testing the client-side initiation.
- This is useful for server-side logic (status stages, account creation, API paths) but cannot produce a real link or phone notification because there is no registered primary on WhatsApp servers.

**Simulation is only for fast iteration on our code.** For real linking tests (notification on primary, successful open), use a real number + real primary.

## Step-by-Step Testing Plan

### Phase 0: Pure Simulation (current, for our code only)
Run:
```bash
node src/scripts/provision-waydroid.js --phone +13185167435 --link-only
```
- Expects: Emulator record + ws_account in `primary_registered`.
- No container started, no WhatsApp installed.
- Use this to verify DB/status/provisioning paths without devices.
- Optional: pass `forceDirect: true` when calling the connect API for this number to test non-proxy handshake code.

To make simulation pure (no Baileys attempt at all), the code now skips the real `linkWithPairingCode` when using the test number + link-only.

### Phase 1: Real Number + Real Primary on Your Phone (recommended first real test)
Use any number you control (your test number or a fresh one from any provider).

1. **Acquire number**
   - Use Grizzly, HeroSMS, 5SIM, SMS-Activate, or any provider.
   - Or use a real SIM you control.
   - Note the number (e.g. +13185167435) and the order ID for the code.

2. **Register the primary on your phone**
   - On your physical phone, install/open WhatsApp.
   - Add the number (or use "add account" if multi-account supported).
   - Request verification.
   - Go to the SMS provider dashboard (or poll their API) and get the WhatsApp SMS code.
   - Enter the code in WhatsApp on the phone.
   - Complete setup: choose name, add profile photo if desired.
   - WhatsApp on the phone is now the registered primary. Note the exact name you set.

3. **Tell our system the primary is registered**
   ```bash
   node src/scripts/provision-waydroid.js --phone +13185167435 --mark-registered
   ```
   - This sets `status = 'primary_registered'` (and acquisition_method if needed).
   - For a fresh number you just acquired, you can also run the provision script with `--link-only` (it will create the emulator record as "registered" and the ws_account).

4. **Request linking from our system (companion side)**
   ```bash
   node src/scripts/provision-waydroid.js --phone +13185167435 --link-only
   ```
   - Or use the API directly:
     ```bash
     curl -X POST http://localhost:3000/api/v1/sessions/connect \
       -H "Authorization: Bearer $TOKEN" \
       -d '{
         "phone": "+13185167435",
         "usePairingCode": true,
         "forceNew": true,
         "forceDirect": true   # for non-proxy test; remove or set real proxyId for production
       }'
     ```
   - You will get an 8-digit code + instructions.
   - The system will start a Baileys socket (with your configured proxy or direct) and send the companion hello.

5. **Accept the link on the phone (primary)**
   - You should receive a push notification or see "Linked Devices" prompt on the phone.
   - Go to WhatsApp Settings → Linked Devices → Link a Device → "Link with phone number instead".
   - Enter the code from step 4.

6. **Verify success**
   - Phone: link shows as connected.
   - Our system:
     - Status becomes `linked` (or `active`).
     - `display_name` is pulled from the primary (the name you set on the phone).
     - Port allocated (if using the transitional flow).
     - You can stop any emulator (none needed in this phone-primary path).
   - Check logs for:
     - Socket open.
     - No "Connection Failure" or 405 after hello.
     - Successful profile sync.

7. **Optional variations to test**
   - With real proxy assigned at link time (instead of `forceDirect`).
   - Different `linkingMethod` values if we expose scan_code / verification_code paths.
   - Force fresh state (`forceNew`).
   - Observe what happens if you try to link before marking `primary_registered` (should be blocked by guards).

### Phase 2: Real Number + Cloud Primary (full headless like Rocket)
1. Acquire number (any provider).
2. Run full provision (no `--link-only`):
   ```bash
   node src/scripts/provision-waydroid.js --phone +YOURNUMBER
   ```
   - This starts Waydroid, installs WhatsApp, etc.
3. Inside the emulator (or via ADB/scripts), complete registration using the SMS code from your provider.
4. Mark registered (or the flow does it).
5. Request pairing code from the system (the code will be entered inside the emulator's WhatsApp).
6. Verify link.
7. Shut down the Waydroid session (Baileys companion continues headless).

### Phase 3: Multiple Linking Paths & Edge Cases
- Test "scan code" and "verification code" import paths (if not yet fully wired, implement minimal support).
- Test with a number that was previously linked elsewhere (force fresh auth state).
- Test proxy rejection vs direct during hello.
- Test realistic client headers / browser string so a real phone primary receives the notification.

## Implementation Notes & Guards (already partially in place)
- Statuses: `primary_registered`, `linking`, `linked`.
- Before `requestPairingCode` for non-test numbers: require status `primary_registered` (or emulator `registered`).
- Proxy is (re)assigned at the linking step.
- `forceDirect` / `noProxy` flag for testing the handshake without a proxy.
- Always fresh state on new pairing attempts (no reuse of partial creds).
- Display name only updated from real primary after successful link.
- For the special test number we intentionally bypass some guards and skip real device work.

## How to Use the Test Number for Real Linking Later
If you want to actually control +13185167435 with a real primary:
1. Register it on your phone (or in a Waydroid session) exactly as described above.
2. Run `--mark-registered`.
3. Proceed with linking.
4. After success you can shut down the phone/emulator.

## Next Steps (from current TODO)
- Make the test-number `--link-only` path 100% pure (no Baileys attempt at all).
- Ensure guards are strict for real numbers.
- Document the phone-primary flow in more places (README, this doc, script help).
- When you are ready with a real registered primary, run the link and share the exact connection.update + disconnect logs if the notification still doesn't appear. We will then tune headers/UA/platform further.

Run the simulation first to confirm the pure-sim path:
```bash
node src/scripts/provision-waydroid.js --phone +13185167435 --link-only
```

Then move to a real phone registration + `--mark-registered` + link.

This plan keeps the simulation fast while giving a repeatable path to validate real linking with a live primary.