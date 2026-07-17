
# Troubleshooting: WhatsApp Pairing via Proxy (Baileys)

This document summarises the main problems encountered when using `/api/v1/sessions/connect` with `usePairingCode: true` behind a residential proxy.

## 1. Phone receives no notification / "couldn't link device"

**Symptom**
- You call the endpoint and receive an 8-digit code.
- You paste the code on the phone instantly.
- WhatsApp shows "couldn't link device".

**Root Cause**
The code returned by Baileys is generated **locally** on the client side (`bytesToCrockford(randomBytes(5))`).  
WhatsApp servers only push a notification (or show the code entry screen) to the primary device **after** a successful `companion_hello` IQ has been accepted from the companion side.

If you never see any prompt on the phone, the `link_code_companion_reg` (stage `companion_hello`) was rejected before it could register a pending link.

**Typical Log Pattern**
```
[PAIRING] Creating Baileys socket ... USING PROXY ...
[PAIRING] Socket created ... awaiting ready...
[PAIRING] Ready event, awaiting socket open...
warn: Session CLOSED ... WebSocket Error (Socks5 proxy rejected connection - NotAllowed)
{"error":"Connection Closed"}
```

**Fix / Workaround**
- The proxy itself must be able to reach WhatsApp's servers.
- General wss tests (e.g. to echo.websocket.events) are **not** sufficient.
- Use a proxy pool that is not blocked for WhatsApp device linking.

---

## 2. SOCKS5 Proxy "rejected connection - NotAllowed"

**Symptom**
```
WebSocket Error (Socks5 proxy rejected connection - NotAllowed) (reconnect=true)
```

**Root Cause**
The proxy server (in this case `proxy-us.proxy-cheap.com:9595`, username `...-res-any`) explicitly refuses the outbound connection to `web.whatsapp.com`.

The general WebSocket test succeeded:
```
✅ SOCKS5 + wss OPEN (tunnel works)
```

But WhatsApp's specific endpoint is blocked at the proxy level for this pool.

**Why it happens**
- "res-any" / heavily shared residential pools are frequently flagged by Meta.
- The provider itself may start rejecting WhatsApp destinations to protect other users.

**How to confirm**
```bash
# Basic IP test (often still works)
curl -v --socks5-hostname user:pass@host:9595 https://ipv4.icanhazip.com

# WhatsApp-specific test (will usually fail or be very slow)
curl -v --socks5-hostname user:pass@host:9595 -I https://web.whatsapp.com
```

**Solution**
Obtain a different proxy (different pool, "fixed" residential, or one the provider confirms works with WhatsApp).  
Import it as `socks5` and pass the new `proxyId`.

---

## 3. HTTP Proxy causes timeout on "awaiting socket open"

**Symptom**
```
[PAIRING] Ready event, awaiting socket open (this can hang if proxy tunnel is slow or not supported)...
{"error":"Timed out waiting for socket ready through proxy after 30000ms..."}
```

**Root Cause**
The HTTP proxy (port 5959) was either:
- Very slow to establish the wss tunnel, or
- Not completing the CONNECT for WhatsApp's servers.

We added a 30 s timeout to stop the HTTP request from hanging forever.

**Lesson**
HTTP proxies (especially on non-standard ports) are less reliable for long-lived binary WebSocket connections than SOCKS5.

---

## 4. Wrong proxy file / credentials used

**Common mistake**
Using the content of `proxys` (HTTP, port 5959, `resfix` user) when you intended to use SOCKS5 from `proxy-sock5` (port 9595, `res-any` user).

**Correct import for SOCKS5**
```bash
PROXY_LINE=$(cat proxy-sock5 | sort -u | head -1)

curl -X POST http://localhost:3000/api/v1/proxies/import \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"text\": \"$PROXY_LINE\",
    \"defaultType\": \"socks5\",
    \"namePrefix\": \"socks5-res-any-\",
    \"region\": \"us\"
  }"
```

The import will often return `skippedIds` if the host+port already exists:
```json
"skippedIds": ["8e20627a-2105-4625-9a3d-8da03c4c5472"]
```

Use that ID in the connect call:
```json
"proxyId": "8e20627a-2105-4625-9a3d-8da03c4c5472"
```

---

## 5. How to verify which proxy is actually being used

Look for these clear markers in the server logs:

```
[PAIRING-CONNECT] Using proxy 8e20627a... (socks5://proxy-us...9595)
>>> PAIRING USING PROXY ID: 8e20627a-... <<<
[PAIRING] Creating Baileys socket ... USING PROXY id=8e20627a... socks5://...
[PAIRING-TRANSPORT] Pairing will go through proxy id=8e20627a...
```

If you still see `http://...5959`, you are still using the old HTTP proxy.

---

## 6. "Connection Closed" or generic errors after socket creation

When the proxy rejects the destination, Baileys surfaces it as:

```
WebSocket Error (Socks5 proxy rejected connection - NotAllowed)
{"error":"Connection Closed"}
```

Even with perfect logging and the MACOS UA patch, if the proxy says "NotAllowed", the connection will never succeed.

---

## 7. Handshake gate (`PAIRING_HANDSHAKE_GATE=1`)

**Symptom**
- UI shows Phase 1 → Phase 2, then either a code (with `Handshake OK` or `Weak accept` badge) or a rejection panel.
- Curl/UI hangs up to ~48s before returning (30s socket open + up to 18s handshake wait).

**What it does**
- With the gate enabled, Baileys still generates the pairing code locally, but the API **does not return it** until WhatsApp accepts (or weak-accepts) the `companion_hello` IQ.
- The supervisor UI listens for Socket.io `wa:pairing_handshake` events for live phase updates:
  - `pending` → Phase 2 (“Verifying WhatsApp accepted link request…”)
  - `accepted` / `accepted_weak` → code shown
  - `rejected` / `ambiguous` → HTTP 422

**Enable**
```bash
# .env
PAIRING_HANDSHAKE_GATE=1
```

**Statuses**
| `handshakeStatus` | Phone notified? | API |
|-------------------|-------------------|-----|
| `accepted` | Yes (restartRequired) | 200 + `pairingCode` |
| `accepted_weak` | Maybe | 200 + `pairingCode` + weak badge |
| `rejected` | No | 422 |
| `ambiguous` | Unknown (timeout) | 422 |

---

## 8. HTTP 422 pairing responses

**When you see 422**
- The Baileys socket connected (or attempted to), but the handshake gate did not get a trusted accept signal.
- **Do not** paste a code from logs or an old response — no pending link was created server-side.

**Typical body**
```json
{
  "error": "Pairing handshake rejected: Connection Failure",
  "handshakeStatus": "rejected",
  "reason": "Connection Failure",
  "statusCode": 405,
  "hint": "Primary device was not notified. Try forceDirect:true, a different proxy, or wait 15 minutes."
}
```

**Fixes**
1. `forceDirect: true` on `/sessions/connect` (skips proxy for this attempt only).
2. Different residential proxy pool (see §2 SOCKS5 NotAllowed).
3. Wait 15+ minutes if rate-limited; do not spam `/connect`.
4. Confirm primary WhatsApp is fully registered and on a recent APK.

The UI maps 422 to the **Phase 3 rejection panel** with `reason`, `statusCode`, and `hint`.

---

## 9. Reverse proxy / nginx timeouts (≥ 120s)

**Symptom**
- Pairing works via `curl http://localhost:3000/...` but fails through nginx/Caddy with `502`, `504`, or empty response mid-request.
- Browser pairing modal resets or shows “Network error” while server logs show a successful code.

**Root cause**
- `/api/v1/sessions/connect` with `usePairingCode: true` and handshake gate can take **up to ~48s** (30s socket ready + 18s handshake). Proxies in front of the app often default to **60s** read timeout.

**Fix (nginx example)**
```nginx
location /api/ {
  proxy_pass http://127.0.0.1:3000;
  proxy_read_timeout 120s;
  proxy_connect_timeout 120s;
  proxy_send_timeout 120s;
}
```

Use **≥ 120s** for any path that triggers pairing (`/sessions/connect`, `/cloud/emulators/provision`, `/cloud/emulators/:id/link`, MoreLogin link endpoints).

---

## Summary – What actually worked / didn't work

| Proxy Type | Port | Result                              | Reason                              |
|------------|------|-------------------------------------|-------------------------------------|
| HTTP       | 5959 | Timeout on socket open              | Slow / unreliable for wss           |
| SOCKS5 (res-any) | 9595 | Proxy rejects with "NotAllowed" | Pool blocked for WhatsApp           |
| General wss test | -    | ✅ Worked                           | Proxy allows non-WA destinations    |

**Conclusion**: The code side (proxy selection, logging, MACOS patch, timeouts, clear error surfacing) is now solid. The remaining blocker is finding a residential proxy that the provider and WhatsApp both allow for device linking.

---

## Recommended Debugging Commands

```bash
# List proxies and their IDs
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/v1/proxies

# Import SOCKS5 from the right file
PROXY_LINE=$(cat proxy-sock5 | sort -u | head -1)
curl ... /proxies/import -d "{ \"text\": \"$PROXY_LINE\", \"defaultType\": \"socks5\" ... }"

# Test basic reachability through SOCKS5
curl -v --socks5-hostname user:pass@host:9595 -I https://web.whatsapp.com

# Test WebSocket tunnel (use a reliable echo)
PROXY_LINE=$(cat proxy-sock5 | head -1)
PROXY_URL="socks5://${PROXY_LINE}"
node -e '
  const {SocksProxyAgent} = require("socks-proxy-agent");
  const WebSocket = require("ws");
  const agent = new SocksProxyAgent(process.env.PROXY_URL);
  const ws = new WebSocket("wss://ws.postman-echo.com/raw", {agent});
  ...
'
```

---

## Code Mitigations Already Implemented

- Proxy ID is now printed with `>>>` markers and `[PAIRING-*]` tags.
- 30 s timeout on socket ready (prevents hanging curls).
- `socks5h://` used for remote DNS.
- MACOS Desktop UA + platform patch to reduce 405 errors.
- Auto-assignment of proxy for pairing flows when none specified.
- Import endpoint returns `skippedIds` so you can still obtain the ID.
- Clearer error messages when a proxy explicitly rejects the connection.
- **Handshake gate** (`PAIRING_HANDSHAKE_GATE=1`): codes exposed only after WA accept/weak-accept; rejections return HTTP 422.
- **Supervisor UI**: pairing modal phases (socket open → handshake verify → code or rejection); all pairing fetch paths check `res.ok`.
- Socket.io `wa:pairing_handshake` for live phase updates during connect.


Correct sequence (recommended for testing with scrcpy):

# 1. Clean stop
waydroid session stop
sudo waydroid container stop

# 2. Fix permissions (common cause of "Permission denied" on the log)
sudo chown -R $USER:$USER /var/lib/waydroid

# 3. Start the container (as root)
sudo waydroid container start

# 4. Start a headless weston compositor (as your normal user)
weston --backend=headless-backend.so --socket=wayland-0 &

# 5. Start the Waydroid session with the correct environment
WAYLAND_DISPLAY=wayland-0 waydroid session start

Wait a few seconds, then:

# 6. Enable adb inside the container
sudo waydroid shell
setprop service.adb.tcp.port 5555
stop adbd
start adbd
exit

# 7. From the host
adb kill-server
adb start-server
adb connect 192.168.240.112:5555
adb devices          # should now show "device"

Then scrcpy:

scrcpy -s 192.168.240.112:5555

(or scrcpy --tcpip=192.168.240.112:5555)

4. If you still get "No route to host" or "Could not find any ADB device"

The bridge (waydroid0) is not ready or not reachable.

Try this full reset sequence:

waydroid session stop
sudo waydroid container stop

sudo waydroid container restart     # or: sudo waydroid container stop && sudo waydroid container start

waydroid session start              # with the weston + WAYLAND_DISPLAY as above

Inside the container again:

sudo waydroid shell
setprop service.adb.tcp.port 5555
stop adbd
start adbd
exit

Then on host:

adb kill-server
adb connect 192.168.240.112:5555
adb devices
__

┌──(kai㉿kai)-[~/Documents/wa-control]
└─$ sudo chown -R $USER:$USER /var/lib/waydroid

┌──(kai㉿kai)-[~/Documents/wa-control]
└─$ ls -la /var/lib/waydroid
total 156
drwxrwxr-x 10 kai  kai   4096 Jun 18 22:24 .
drwxr-xr-x 59 root root  4096 Jun  7 20:30 ..
drwxrwxr-x  2 kai  kai   4096 Jun 13 04:38 cache_http
drwxrwxr-x  2 kai  kai   4096 Jun  7 21:05 host-permissions
drwxrwxr-x  2 kai  kai   4096 Jun  7 21:05 images
drwxrwxr-x  3 kai  kai   4096 Jun  7 21:05 lxc
drwxrwxr-x  3 kai  kai   4096 Jun  7 21:05 overlay
drwxrwxr-x  4 kai  kai   4096 Jun 13 04:38 overlay_rw
drwxrwxr-x  4 kai  kai   4096 Jun 13 05:18 overlay_work
drwxrwxr-x  2 kai  kai   4096 Jun  7 21:05 rootfs
-rw-rw-r--  1 kai  kai    448 Jun 13 04:38 waydroid_base.prop
-rw-rw-r--  1 kai  kai    505 Jun 18 22:24 waydroid.cfg
-rw-r--r--  1 kai  kai  98737 Jun 19 20:10 waydroid.log
-rw-rw-r--  1 kai  kai    749 Jun 18 22:24 waydroid.prop

┌──(kai㉿kai)-[~/Documents/wa-control]
└─$ sudo waydroid container start
[20:13:36] Container service is already running

┌──(kai㉿kai)-[~/Documents/wa-control]
└─$ weston --backend=headless-backend.so --socket=wayland-0 &
[1] 103635

┌──(kai㉿kai)-[~/Documents/wa-control]
└─$ Date: 2026-06-19 MDT
[20:14:14.702] weston 15.0.1
               https://wayland.freedesktop.org
               Bug reports to: https://gitlab.freedesktop.org/wayland/weston/issues/
               Build: 15.0.1
[20:14:14.703] Command line: weston --backend=headless-backend.so --socket=wayland-0


_________

┌──(kai㉿kai)-[~/Documents/wa-control]
└─$ sudo waydroid shell
[sudo] password for kai: 
:/ # setprop service.adb.tcp.port 5555
:/ # stop adbd
:/ # start adbd
:/ # exit

┌──(kai㉿kai)-[~/Documents/wa-control]
└─$ adb kill-server 
cannot connect to daemon at tcp:5037: Connection refused

┌──(kai㉿kai)-[~/Documents/wa-control]
└─$ adb start-server

┌──(kai㉿kai)-[~/Documents/wa-control]
└─$ adb connect 192.168.240.112:5555
failed to connect to '192.168.240.112:5555': No route to host
____

┌──(kai㉿kai)-[~/Documents/wa-control]
└─$ WAYLAND_DISPLAY=wayland-0 waydroid session start
[20:16:57] Android with user 0 is ready
[20:17:26] Android with user 0 is ready
[20:17:56] Android with user 0 is ready

----
