# WA Control — Rocket WS Cloud Control (Legal Raw Control System)

**Goal**: A holistic, raw-control WhatsApp multi-account management system modeled **exactly** after the "火箭WS云控操作手册" (Rocket WS Cloud Control) user manual.

- Full supervisor desk (主管台) and customer service desk (客服台) experience.
- "Raw control" via linked-device sessions (QR scan, pairing, profile mutation, presence, groups, etc.).
- Proxies per port/number for geo distribution.
- Number warming (养号) for owned numbers only.
- Port system for internal capacity tracking ("purchase" for allocation/expiry tracking, not sales).
- All PDF features implemented (including cold blast / 爆粉群发 and "hijack-style" login flows), even if not used in daily ops. For your usage: treat any "hijacked/scanned" numbers as legitimately owned/controlled by your org. No actual third-party hijacking.

**Important**:
- This is a **completely separate system** from the previous `whatsapp-saas` multi-tenant official-API SaaS.
- Built on **@whiskeysockets/baileys** (the standard library for WhatsApp Web multi-device control). We do not implement the protocol ourselves.
- Backend-focused initially, with a functional web UI for the desks to match the PDF experience.
- Designed for internal/team use managing many owned numbers + agents.

See `TASKS.md` for the comprehensive, agent-assignable sequential implementation plan.

## Core Concepts (matching PDF)
- **Ports (端口)**: The fundamental capacity unit. "Purchase"/allocate ports of different types (normal, fast-warm). Track purchase, start, expiry, remaining. Each active WS number typically occupies one port.
- **WS Numbers / Accounts (WS号)**: Linked via Baileys (scan or phone assoc). Belong to groups, can be in warehouse or active, assigned to ports.
- **Account Warehouse (账号仓库)**: Holding area for unused numbers with dedicated port capacity.
- **养号池 + 养号任务**: Warming pool and scheduled tasks. Numbers must be "offline" to enter. Different modes/speeds. Uses behavior simulation on the live session.
- **粉丝 / Contacts**: Your owned qualified leads + support for imported data pools. Tagging (标签), sources.
- **分流链接**: Public-ish links or endpoints that attribute new leads/fans to specific WS numbers + stats.
- **群发**: 粉丝群发 (to qualified) + 爆粉群发 (cold to strangers from pools) — implemented with safeguards.
- **客服台**: Multi-agent real-time desk. Agents log in separately, see sessions across numbers, chat, pull contacts, quick replies from materials, group chats.
- **主管台**: Full control — import, groups, batch ops, port mgmt, warming tasks, materials (avatars, nicks, messages), group pull (拉群), exports, stats, agent mgmt.
- **Materials (素材库)**: Reusable avatars (images), nicknames (text), message templates.
- **拉群**: Group creation, QR/link generation, adding members (using numbers that have appropriate privileges).
- **数据迁移 / 粉丝继承**: Tools to move fans/contacts + history from one number to another (e.g. on issues).

## Tech Stack (initial)
- Node.js (ESM)
- Express + Socket.io (realtime for desks)
- PostgreSQL + Knex
- Redis + BullMQ (jobs for warming, blasts, group tasks, exports)
- @whiskeysockets/baileys (core WA sessions)
- Custom SessionManager + Proxy injection per socket
- Zod validation
- JWT for auth (supervisor + agents with roles/permissions)
- Multer + Sharp for asset uploads/processing
- Winston / Pino logging

Frontend: To be decided in planning (React + Vite recommended for speed to match PDF UI density, or progressive enhancement on Express views). The backend will expose everything needed for a rich desk UI (REST + Socket events for QR, sessions, incoming messages, etc.).

## Running (later)
See scripts after setup.

**Legal / Usage Note**: This system gives powerful low-level control. Use responsibly and only with numbers and contacts you fully own/control and have proper consent/legitimate interest for. Implement rate limiting, consent flags, audit logs, and monitoring from day one. The presence of "cold" features does not mean you should use them.

## Status
See TASKS.md for the detailed sequential agent-ready task breakdown.
