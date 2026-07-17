# E2E Pairing Checklist (Manual)

Use this checklist to validate pairing handshake behavior end-to-end with a **real primary WhatsApp** (phone or cloud emulator). Automated integration tests in `tests/session-handshake-integration.test.js` cover mocked `connection.update` sequences; this document covers live infrastructure.

**Prerequisites**

- `PAIRING_HANDSHAKE_GATE=1` in `.env` (see `.env.example`)
- API running: `npm run dev` or `npm start`
- Valid JWT: `export TOKEN=...`
- Reverse-proxy read timeout ≥ **120s** if not hitting localhost directly (see `docs/troubleshoot.md` §9)
- Primary number status `primary_registered` before linking (`--mark-registered` or provision flow)

---

## 1. Blocked proxy → HTTP 422 (no code)

**Goal:** Confirm the handshake gate rejects companion_hello when the proxy pool blocks WhatsApp, and the primary device is **not** notified.

| Step | Action | Expected |
|------|--------|----------|
| 1.1 | Assign a known-bad SOCKS5 proxy (e.g. `res-any` pool that returns `NotAllowed` for `web.whatsapp.com`) to the test account | Proxy ID visible in `GET /api/v1/proxies` |
| 1.2 | `curl -v --socks5-hostname user:pass@host:port -I https://web.whatsapp.com` | Failure or `NotAllowed` |
| 1.3 | `POST /api/v1/sessions/connect` with `{ "phone": "+1...", "usePairingCode": true, "forceNew": true }` | HTTP **422** |
| 1.4 | Response body | `handshakeStatus: "rejected"`, `reason: "Connection Failure"`, `statusCode: 405`, `hint` present |
| 1.5 | Response body | **No** `pairingCode` field |
| 1.6 | Primary WhatsApp | **No** link-device notification |
| 1.7 | `ws_accounts.status` | `primary_registered` (not `offline`, not stuck `linking`) |
| 1.8 | Server logs | `[PAIRING-HANDSHAKE] event=rejected`; optional `[PAIRING] Proxy-level rejection` |
| 1.9 | Supervisor UI pairing modal | Phase 3b rejection panel; **do not** show a code |

**Retry:** `forceDirect: true` on the same request should be used in a follow-up test (section 2) — not mixed into this negative case.

---

## 2. Good path → primary notification + accepted code

**Goal:** WhatsApp accepts `companion_hello`; API returns code only after accept; phone receives link prompt.

| Step | Action | Expected |
|------|--------|----------|
| 2.1 | Use a residential proxy that passes `curl -I https://web.whatsapp.com` **or** `forceDirect: true` for isolation | `[PAIRING-CONNECT] No proxy (direct)` or proxy line in logs |
| 2.2 | Ensure primary is registered and online on the phone/emulator | WhatsApp open, number active |
| 2.3 | `POST /api/v1/sessions/connect` `{ "phone": "+1...", "usePairingCode": true, "forceNew": true }` | HTTP **200** within ~5–45s |
| 2.4 | Response | `pairingCode` (8 chars), `handshakeStatus: "accepted"` or `"accepted_weak"`, `handshakeWaitMs` > 0 |
| 2.5 | `ws_accounts.status` | `linking` immediately after request starts; remains until Baileys `open` |
| 2.6 | Primary device | Push notification or **Linked devices → Link with phone number** prompt |
| 2.7 | Socket.io (supervisor desk) | `wa:pairing_handshake` `pending` → `accepted` / `accepted_weak`, then `wa:pairing_code` |
| 2.8 | Enter code on primary within ~2 minutes | Link completes |
| 2.9 | Baileys `connection === 'open'` | `ws_accounts.status = linked`; `display_name` synced if empty |
| 2.10 | `accepted_weak` only | UI shows weak-accept badge; still attempt code entry promptly |

---

## 3. `includePending` observability during handshake

**Goal:** Supervisors can poll in-flight handshake phases before a code is exposed.

| Step | Action | Expected |
|------|--------|----------|
| 3.1 | Start `POST /sessions/connect` (pairing) from terminal A | Request in flight (Phase 2 in UI) |
| 3.2 | From terminal B: `GET /api/v1/sessions/pairing-codes?includePending=true` while Phase 2 active | Entry with `handshakeStatus: "pending"`, **no** `code` field |
| 3.3 | After HTTP 200 | Same account appears with `code` and `handshakeStatus: "accepted"` |
| 3.4 | `GET /api/v1/sessions/pairing-codes` (default) | Only accepted codes; pending/rejected omitted |
| 3.5 | After 422 rejection | `includePending=true` may show `rejected` / `ambiguous` with `reason`; never a `code` |

---

## 4. Cloud emulator: `linking` until Baileys `open`

**Goal:** Emulator/MoreLogin status must not flip to `linked` when only the pairing code is issued.

| Step | Action | Expected |
|------|--------|----------|
| 4.1 | Provision emulator (Waydroid or MoreLogin) and complete primary registration inside it | `cloud_emulators.status = registered` |
| 4.2 | `POST /api/v1/cloud/emulators/:id/link` or `POST /api/v1/cloud/morelogin/:id/link` | HTTP 200 with `pairingCode`, `handshakeStatus: "accepted"` |
| 4.3 | `cloud_emulators.status` immediately after link API | **`linking`** (not `linked`) |
| 4.4 | Enter pairing code inside emulator WhatsApp | Link prompt accepted on device |
| 4.5 | Wait for Baileys session open (or use `linkAndWait` in scripts) | `cloud_emulators.status = linked`, `last_linked_at` set |
| 4.6 | On handshake 422 | `cloud_emulators.status = error`; emulator not marked `linked` |
| 4.7 | `provision-morelogin.js --link` | Uses `linkAndWait`; `--power-off` only after `open` confirmed |

---

## 5. Quick regression matrix

| Scenario | HTTP | `pairingCode` | Primary notified | Account status after |
|----------|------|---------------|------------------|----------------------|
| Bad proxy / 405 | 422 | No | No | `primary_registered` |
| Good direct / good proxy | 200 | Yes | Yes | `linking` → `linked` on open |
| Handshake timeout (18s) | 422 | No | Unknown | `primary_registered` |
| Overlapping connect calls | 409 | No | — | unchanged |

---

## 6. Commands reference

```bash
# Connect with pairing code (handshake gate on)
curl -sS -X POST "http://localhost:3000/api/v1/sessions/connect" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"phone":"+13185167435","usePairingCode":true,"forceNew":true,"forceDirect":true}' | jq .

# Poll live codes + pending phases
curl -sS "http://localhost:3000/api/v1/sessions/pairing-codes?includePending=true" \
  -H "Authorization: Bearer $TOKEN" | jq .

# Cloud emulator link (stays linking until open)
curl -sS -X POST "http://localhost:3000/api/v1/cloud/emulators/EMULATOR_UUID/link" \
  -H "Authorization: Bearer $TOKEN" | jq .
```

---

## Sign-off

| Check | Owner | Date | Pass |
|-------|-------|------|------|
| §1 Blocked proxy → 422 | | | ☐ |
| §2 Good path → notification | | | ☐ |
| §3 includePending | | | ☐ |
| §4 Emulator linking until open | | | ☐ |

**Related docs:** `docs/troubleshoot.md` (§7 handshake gate, §8 HTTP 422), `docs/testing-plan.md`, `docs/CLOUD_PHONELESS.md`.