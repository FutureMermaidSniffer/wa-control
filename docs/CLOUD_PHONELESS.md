# Running WhatsApp Completely Phone-Less (Cloud / Headless)

This document explains how to operate the wa-control system **without any physical phones** after the initial setup.

> **Important Legal / Risk Note**: WhatsApp's terms of service prohibit automated / bulk / commercial use outside their official Business API. Using emulators + custom clients carries a high risk of permanent bans. This guide is provided for educational / internal controlled use only. Treat all numbers as legitimately owned.

## High-Level Architecture for Phone-Less Operation

1. **Cloud Android Environment** (the "primary device")
   - Run a full Android OS in the cloud (emulator or container).
   - Install official WhatsApp.
   - Register the phone number (using virtual/temp SMS services).
   - This acts as the "primary" WhatsApp installation.

2. **Linking to wa-control (Baileys companion)**
   - Use the **pairing code** flow (preferred for automation) instead of QR scanning.
   - The wa-control server starts a Baileys socket and requests a pairing code.
   - You (or automation) enter the code inside the WhatsApp app running in the cloud Android environment.
   - Once linked, the auth state is persisted in Postgres.
   - You can now **shut down the Android environment** — the Baileys session continues running headless in the cloud.

3. **Ongoing Operation**
   - All sending, receiving, profile changes, warming, group pulls, etc. happen through the Baileys linked session (proxied if desired).
   - The system already stores encrypted `baileys_auth_state` so sessions survive restarts.

This gives you true "cloud WhatsApp" numbers that only ever lived in virtualized environments.

## Recommended Cloud Android Stack (2026 update)

**Preferred: Outsourced MoreLogin Cloud Phones** (fully implemented)
- Use Open API + Local API at `https://api.morelogin.com`
- See `docs/MORELOGIN_INTEGRATION_PLAN.md` and `src/cloud/morelogin.*`
- Separate sequence: supplier number+code → create ML cloud phone → install WA + enter code on it → Baileys link → power off.
- Always powerOff after primary registration to control cost.
- SKU examples: 10004 (Android 15)

### Legacy Option A: Self-hosted (Waydroid etc)
- **Android-x86** running in QEMU/KVM...
- **Waydroid** (kept for transition only; new work uses MoreLogin)

Example setup (Waydroid on Ubuntu VPS):
```bash
# On your cloud VPS
sudo apt update
# Install Waydroid (see official docs: https://docs.waydro.id/)
# Then launch a Waydroid session, install WhatsApp APK, etc.
```

You can run multiple instances (one per number or small groups) and script the registration + linking.

### Option B: Managed / Easy
- Services that provide remote Android phones (search for "cloud android" or "virtual android device").
- Some "WhatsApp API" providers internally do exactly this.

### Option C: Docker + Android-x86 (for scripting)
Many people script full pipelines with:
- `docker run` Android-x86 images
- `adb` to control the device
- `scrcpy` or custom automation for UI interaction (registering, entering codes)

## Step-by-Step Phone-Less Flow with wa-control

### 1. Provision the Cloud Android Environment
- Start your emulator/container.
- Install WhatsApp from APKMirror or Play Store (inside the emulator).
- Use a virtual number provider (SMS-Activate, Tiger SMS, 5SIM, etc.) to get a number.
- Complete registration inside WhatsApp (SMS verification + any additional checks).

At this point you have a working WhatsApp installation **inside the cloud environment**.

### 2. Link it to wa-control using Pairing Code (No QR Scanning Needed)

Use the enhanced connect endpoint (or the UI if extended):

```bash
curl -X POST http://localhost:3000/api/v1/sessions/connect \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+15551234567",
    "acquisitionMethod": "phone_assoc",
    "usePairingCode": true,
    "portId": "...",
    "proxyId": "..."
  }'
```

The response will look like:

```json
{
  "accountId": "...",
  "phone": "+15551234567",
  "pairingCode": "12345678",
  "status": "enter_pairing_code",
  "instructions": "Enter this 8-digit code in the WhatsApp app (running in your cloud emulator) to link the session without scanning a QR."
}
```

### 3. Enter the Code in the Emulator

- Go to the WhatsApp app running in your cloud Android environment.
- Go to **Linked Devices** → **Link a Device** (or the equivalent flow for pairing code entry).
- Enter the 8-digit code returned by the API.
- The linking should complete within seconds.

### 4. Shut Down the Emulator

Once you see `connection: 'open'` (or the account appears as "active" in the UI), you can safely terminate the Android environment.

The auth state is now stored encrypted in the database. Future reconnections will use the saved credentials.

### 5. Use the Account Normally

- The number now appears in your desk, can be used for warming, blasts, group pulls, etc.
- All traffic can go through your per-account proxies.
- No physical (or even virtual) phone needs to stay running.

## Code Changes Made to Support This

- `src/core/sessions/SessionManager.js`: Added `requestPairingCode(accountId, phoneNumber)` method that calls Baileys' native `sock.requestPairingCode(...)` and emits a `pairing_code` event.
- `src/api/controllers/sessions.controller.js`: Extended `connectNumber` to support `usePairingCode: true` or `acquisitionMethod: "phone_assoc"`. Returns the code instead of (or in addition to) a QR.
- `src/api/routes/sessions.routes.js`: Added documentation comments for the cloud pairing flow.
- New documentation: `docs/CLOUD_PHONELESS.md` (this file).

The existing UI already surfaces QR codes via Socket.io. You can extend the frontend or use the raw API for pairing codes.

## Tips for Production-Grade Cloud Operation

- **Use good mobile/ISP proxies** per account (the system already supports this per `ws_accounts.proxy_id`).
- **Warm numbers carefully** — cloud-registered numbers often need more careful warming because of the emulator fingerprint.
- **Monitor health** — the system already has health scoring and reconnect logic.
- **Rotate environments** — periodically re-link from a fresh emulator instance if you notice degradation.
- **Handle virtual SMS providers** carefully — many have high reuse rates which increase ban risk.
- **Device fingerprinting** — advanced setups randomize Android ID, IMEI (where possible), build props, etc. inside the emulator.
- **Keep some diversity** — mix cloud emulators with occasional real-device registrations if scale allows.

## Limitations

- Some WhatsApp features still prefer or require the "primary" device to have been a real phone at some point.
- Very aggressive use (high volume cold blasts, etc.) will still get banned regardless of cloud vs physical.
- You are responsible for complying with WhatsApp ToS and local laws.

## Next Steps / Automation Ideas

- Write a small controller that provisions a Waydroid/Android-x86 instance, installs WhatsApp, registers via your SMS provider API, then calls the pairing code endpoint and automatically enters the code via ADB.
- Store emulator metadata alongside each `ws_account` (which cloud host it was registered on, etc.).
- Add a "re-link from cloud" button in the supervisor UI.

This gives you a fully cloud-native, phone-less pipeline while still using the powerful raw Baileys control that wa-control provides.

If you implement the automation layer on top of this, feel free to contribute back the helper scripts!

## Troubleshooting "couldn't link device" (even when pasting fast)

This is usually caused by WhatsApp server rejecting the companion handshake from Baileys:

- **Primary cause (fixed in this version)**: Browser identifier sent in pairing request + UA. We now default to `Browsers.macOS('Desktop')` (and env `WA_BROWSER=mac` override). Ubuntu/Chrome often gets 405/408/515 during `companion_hello` → phone shows couldn't link.
- Reconnects too slow or too spammy after the code is issued (code window is short). We now use sub-second reconnects for restartRequired + reminders.
- Calling `/connect` again while a code is live (invalidates it).
- Primary WhatsApp (emulator) not fully registered, or using an old WhatsApp APK that lacks "Link with phone number instead".
- Using a datacenter/VPS IP without proxy — WA is aggressive about new device links.
- Partial old `baileys_auth_state` left behind (the code auto-resets when it sees `me` or `pairingCode`).

**Debug while testing**:
- Use the new `GET /api/v1/sessions/pairing-codes` (auth required) to see live pending codes.
- Watch the server terminal: we now print a huge visible banner + repeat every ~8s:
    ```
    WHATSAPP PAIRING CODE READY ...
      CODE  : J2W9XBHX
    ```
- Look for `[PAIRING-DEBUG]` logs on connection.update.
- Try with no proxy first (for a test number).
- Force fresh: pass `"forceNew": true` is not exposed in API yet, but disconnect + re-create account or null the auth_state row manually.

If it still fails consistently, fall back to the QR flow for that number (QR is more tolerant of platform strings in 2026).

### Why your phone receives no notification/prompt at all (the core issue you identified)

Yes — your diagnosis is correct.

The code (`2YC3MDH7` etc.) printed by the server is generated **client-side only**:

```js
// inside Baileys requestPairingCode
const pairingCode = customPairingCode ?? bytesToCrockford(randomBytes(5));
...
authState.creds.pairingCode = pairingCode;
await sendNode({ ... 'link_code_companion_reg', stage: 'companion_hello', ... });
return pairingCode;
```

WhatsApp servers do not hand you a code. They only create a pending link *if* that `companion_hello` IQ is received and accepted over the websocket. Only then does the primary phone get a notification/push to show the input field.

In your logs you see the banner, then within ~3 seconds:

```
[PAIRING-DEBUG] ... conn=close ... lastErr=Connection Failure
```

This means the server terminated the stream (with a failure code, usually 405 or similar) around the time we tried to send (or right after) the hello. No pending link was ever created server-side → your phone never hears about it.

When you open official WhatsApp Web and request the code there, *their* client successfully performs the equivalent hello from a browser context that WA currently trusts, so the notification arrives instantly on the phone.

The macOS Desktop + longer-settle + syncFullHistory changes we made are attempts to look more like a legitimate desktop companion. They are not always sufficient if the source IP, ASN, or other signals look "automated / VPS".

See the enhanced banner that is now printed — it explains exactly this. The new detailed Connection Failure logs also surface the numeric statusCode + data.
