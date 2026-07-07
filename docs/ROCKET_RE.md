# Rocket WS Cloud Control Reverse Engineering Notes (pn3.rocketgo.vip)

Target: https://pn3.rocketgo.vip/chat/newchat ("客服管理系统" = Customer Service Management System)

Credentials provided: ZT011 / ss123123 (captcha handled by operator).

## Frontend Technology
- Vue 2 + Element UI (webpack chunks dated 20260624).
- Very similar to ruoyi-vue (standard Chinese admin template).
- axios `baseURL: "/prod-api"`
- Heavy i18n (zh + Indonesian + English strings visible in bundles).
- Main desk views:
  - Supervisor: accountManagement, portRecord, accountWarehouse, groupChatMassProduction, apiInterface, etc.
  - CS Desk: "newchat" / customerServiceDesk (the `/chat/newchat` route).

## Critical Backend API Base
All authenticated (and most public) calls go through:
```
https://pn3.rocketgo.vip/prod-api/...
```

Key discovered endpoints (from bundle strings + probes):
- `POST /prod-api/login`                    { username, password, code, uuid [, khUsername?] }
- `GET  /prod-api/captchaImage?uuid=...`   returns { img: base64, uuid, captchaEnabled, code?, msg }
- `GET  /prod-api/getInfo`
- `POST /prod-api/logout`
- `/prod-api/portStatistics`
- `/prod-api/setting/account/userport`
- `/prod-api/system/user/*` (profile, list, resetPwd, etc.)
- Account/WS flows likely under:
  - `/prod-api/biz/account/...` or `/prod-api/account/...` or `/prod-api/wsAccount/...`
  - Similar for chat: `/prod-api/biz/chat/...`, `/prod-api/chat/...`, `/prod-api/customerservice/...`
- "loginVerificationCode" section → device linking / verification code flow for WS accounts (very relevant to local pairing).
- "chatGroup" + "batchCreatGroup" → group pull / mass group creation (matches local groupPulls).
- "apiInterface" + share/scan → probably sharing of login codes or external API tokens.

## Login Flow (client mimic)
1. Generate uuid client-side.
2. `GET /prod-api/captchaImage?uuid=xxx` → show `img` (base64 jpeg).
3. User types visible code.
4. `POST /prod-api/login` with the 4 fields.
5. Store returned `token` (often top level or under `data`).
6. Subsequent calls: `Authorization: Bearer <token>` (and/or cookies).

## Realtime / Chat (newchat)
Not obvious long-lived WS in initial bundles (no wss:// strings found in main chunks).
Likely mix of:
- Polling for new messages / session list updates in the CS desk.
- Or a separate socket endpoint loaded in a lazy chunk for "newchat".
- Incoming messages probably pushed or polled per selected WS account + customer session.

When we have a valid session we will probe:
- List of manageable WS accounts for the logged in user.
- Per-account "sessions" (open customer chats) that appear in the left panel of newchat.
- Message history + send endpoints.
- Unread counts, pinning, grouping.

## How this helps wa-control
Local system already has:
- Ports + accounts + warehouse
- Pairing code (phone_assoc)
- Warming jobs + materials (avatars/nicks)
- CS desk (realtime via socket.io + messages persistence)
- Blasts (fan + cold)
- Group pulls
- Proxy injection per session (Baileys)

RE goals:
- Exact request/response shapes for accounts (status model, port linkage, "merchant" accounts?).
- How "newchat" desk represents live customer sessions (is it full contact list or only recently messaged?).
- Device linking details (verification code import, scan code import).
- Any presence / typing / read receipt patterns.
- Port / capacity semantics (userport endpoint).
- Safety / rate behaviors that the real system enforces (or doesn't).

## Using the RE script
See `src/scripts/re-rocket.js`

Typical flow:
```bash
node src/scripts/re-rocket.js captcha
# view captcha-current.png (160x60 jpeg), note the chars
node src/scripts/re-rocket.js login --user ZT011 --pass ss123123 --code THE4CHARS --uuid <printed-uuid>

node src/scripts/re-rocket.js getinfo
node src/scripts/re-rocket.js explore
node src/scripts/re-rocket.js chat
node src/scripts/re-rocket.js call GET /prod-api/...
```

You can also login in real browser → copy token or full Cookie header → 
```bash
node src/scripts/re-rocket.js set-token ey...
# or
node src/scripts/re-rocket.js set-cookie 'JSESSIONID=...; ...'
```

## Next (when authenticated)
- Dump account list shape + any "portId" / "proxy" / health fields.
- Dump active chat sessions from the CS desk view.
- Identify send message endpoint used by agents.
- Look for warming-like scheduled behavior or profile mutation endpoints (if exposed).
- Look at batch group creation payloads.

Update this file with findings as we call the live endpoints.
