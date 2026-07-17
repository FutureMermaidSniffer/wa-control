import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import config from './config/index.js';
import db from './db/connection.js';
import { logger } from './utils/logger.js';

// Routes and middleware per TASKS.md Phase 0
import errorHandler from './api/middleware/errorHandler.js';
import notFound from './api/middleware/notFound.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }, // tighten in prod
});

// Basic middleware (will be expanded)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      "default-src": ["'self'"],
      "script-src": ["'self'", "'unsafe-inline'"],  // allow inline for our simple UI
      "script-src-attr": ["'unsafe-inline'"],       // required for onclick= etc.
      "style-src": ["'self'", "'unsafe-inline'"],
      "img-src": ["'self'", "data:", "blob:"],
      "connect-src": ["'self'", "ws:", "wss:"],
    },
  },
}));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Basic static for frontend skeleton (Phase 0.5)
app.use('/static', express.static('frontend/public'));

// Serve uploaded materials (avatars etc.) - for now public; can auth-protect later
app.use('/uploads', express.static(config.UPLOAD_DIR || './uploads'));

// Silence Chrome DevTools probing (harmless 404 spam)
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.json({});
});
if (config.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Health (always first)
app.get('/', (req, res) => res.redirect('/static/index.html'));
app.get('/desk', (req, res) => res.redirect('/static/index.html'));

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'wa-control',
    time: new Date().toISOString(),
    env: config.NODE_ENV,
  });
});

// Placeholder API root
app.get('/api/v1', (req, res) => {
  res.json({ message: 'WA Control API - see TASKS.md for roadmap' });
});

// Mount routes as they are implemented (per TASKS.md)
import authRoutes from './api/routes/auth.routes.js';
app.use('/api/v1', authRoutes);

import sessionsRoutes from './api/routes/sessions.routes.js';
app.use('/api/v1', sessionsRoutes);

import portsRoutes from './api/routes/ports.routes.js';
app.use('/api/v1', portsRoutes);

import proxiesRoutes from './api/routes/proxies.routes.js';
app.use('/api/v1', proxiesRoutes);

import accountsRoutes from './api/routes/accounts.routes.js';
app.use('/api/v1', accountsRoutes);

import warmingRoutes from './api/routes/warming.routes.js';
app.use('/api/v1', warmingRoutes);

import materialsRoutes from './api/routes/materials.routes.js';
app.use('/api/v1', materialsRoutes);

import contactsRoutes from './api/routes/contacts.routes.js';
app.use('/api/v1', contactsRoutes);

import messagesRoutes from './api/routes/messages.routes.js';
app.use('/api/v1', messagesRoutes);

import blastsRoutes from './api/routes/blasts.routes.js';
app.use('/api/v1', blastsRoutes);

import cloudRoutes from './api/routes/cloud.routes.js';
app.use('/api/v1', cloudRoutes);

import groupPullsRoutes from './api/routes/groupPulls.routes.js';
app.use('/api/v1', groupPullsRoutes);

import messagesData from './data/messages.data.js';
import { extractPeer } from './utils/wa-jid.js';

// SessionEngine facade FIRST so workers share the same Baileys sockets + events
import SessionManager from './core/sessions/SessionManager.js';
import { SessionEngine, setSessionEngine, getSessionEngine } from './core/engine/SessionEngine.js';
import { setSessionManager } from './api/controllers/sessions.controller.js';
const sessionManager = new SessionManager(db);
const sessionEngine = new SessionEngine(db, sessionManager);
app.set('sessionManager', sessionManager);
app.set('sessionEngine', sessionEngine);
setSessionEngine(sessionEngine);
setSessionManager(sessionEngine);

// Jobs / workers (BullMQ + Redis) — after engine is registered
import { startWarmingWorker } from './jobs/workers/warming.worker.js';
import { closeQueues } from './jobs/queues.js';
let warmingWorker;
try {
  warmingWorker = startWarmingWorker();
} catch (e) {
  logger.warn('Could not start warming worker (Redis may be down):', e.message);
}

import { startBlastWorker } from './jobs/workers/blast.worker.js';
let blastWorker;
try {
  blastWorker = startBlastWorker();
} catch (e) {
  logger.warn('Could not start blast worker (Redis may be down):', e.message);
}

import { startGroupPullWorker } from './jobs/workers/groupPull.worker.js';
let groupPullWorker;
try {
  groupPullWorker = startGroupPullWorker();
} catch (e) {
  logger.warn('Could not start groupPull worker (Redis may be down):', e.message);
}

// 404 + error handling (must be last)
app.use(notFound);
app.use(errorHandler);

// Wire engine events to Socket.io (QR includes PNG data URL for desk UI)
sessionEngine.on('qr', ({ accountId, phone, qr, qrDataUrl }) => {
  io.emit('wa:qr', { accountId, phone, qr, qrDataUrl });
});

sessionEngine.on('pairing_code', ({ accountId, phone, code }) => {
  io.emit('wa:pairing_code', { accountId, phone, code });
});
sessionEngine.on('connected', async ({ accountId, phone, reconnected }) => {
  io.emit('wa:connected', { accountId, phone, reconnected: !!reconnected });

  // Auto-warming: if the account has auto_warm=true set, immediately schedule a warming task.
  // This lets operators link a number and have warming start without a second API call.
  try {
    const acc = await db('ws_accounts').where({ id: accountId }).first();
    if (acc?.auto_warm) {
      const existing = await db('warming_tasks')
        .where({ ws_account_id: accountId })
        .whereNotIn('status', ['completed', 'cancelled'])
        .first();
      if (!existing) {
        const { scheduleWarmingTask } = await import('./jobs/queues.js');
        const warmingData = (await import('./data/warming.data.js')).default;
        const task = await warmingData.createWarmingTask({
          ws_account_id: accountId,
          mode: acc.warm_mode || 'normal',
          target_days: acc.warm_target_days || 10,
          status: 'pending',
          progress_days: 0,
        });
        await scheduleWarmingTask(task.id, 5000).catch(() => {});
        logger.info(`Auto-warming scheduled for ${phone} (accountId=${accountId})`);
        io.emit('wa:warming_started', { accountId, phone, taskId: task.id });
      }
    }
  } catch (e) {
    logger.warn('Auto-warm check failed (non-critical)', { accountId, error: e.message });
  }
});
sessionEngine.on('disconnected', (payload) => {
  io.emit('wa:disconnected', payload);
});

// Persist incoming/outgoing messages from Baileys + update conversations + broadcast live
sessionEngine.on('messages.upsert', async ({ accountId, messages }) => {
  for (const msg of (messages || [])) {
    try {
      const remoteJid = msg.key?.remoteJid;
      if (!remoteJid) continue;
      // Skip status / broadcast noise
      if (remoteJid === 'status@broadcast' || remoteJid.endsWith('@broadcast')) continue;

      const peer = extractPeer(msg);
      // Conversation key: full group JID for groups (keeps group threads together),
      // else phone digits (or LID digits if no PN yet)
      const contactPhone = peer.isGroup
        ? (peer.groupJid || remoteJid)
        : (peer.phone || remoteJid.replace(/@.*/, ''));
      let pushName = peer.pushName;

      // Resolve group subject for display (cache in conversation name)
      if (peer.isGroup) {
        try {
          const meta = await sessionEngine.getGroupMetadata(accountId, contactPhone).catch(() => null);
          if (meta?.subject) pushName = meta.subject;
        } catch (_) { /* ignore */ }
      }

      const text = msg.message?.conversation ||
                   msg.message?.extendedTextMessage?.text ||
                   (msg.message?.imageMessage ? '[image]' : '') ||
                   (msg.message?.videoMessage ? '[video]' : '') ||
                   (msg.message?.documentMessage ? '[document]' : '') ||
                   (msg.message?.audioMessage ? '[audio]' : '');

      if (!text) continue;

      // Group threads: conversation name = subject; bubble text shows "Sender: message"
      let storeText = text;
      if (peer.isGroup && !msg.key.fromMe && peer.pushName) {
        storeText = `${peer.pushName}: ${text}`;
      }

      const convo = await messagesData.findOrCreateConversation(accountId, contactPhone, pushName);

      await messagesData.createMessage({
        conversation_id: convo.id,
        ws_account_id: accountId,
        direction: msg.key.fromMe ? 'out' : 'in',
        text: storeText,
        wa_message_id: msg.key?.id,
        timestamp: msg.messageTimestamp ? new Date(Number(msg.messageTimestamp) * 1000) : new Date(),
        raw: {
          key: msg.key,
          message: msg.message,
          pushName: peer.pushName,
          groupSubject: peer.isGroup ? pushName : null,
          peer: { jid: peer.jid, isLid: peer.isLid, displayId: peer.displayId, isGroup: peer.isGroup },
        },
      });

      // Auto-capture contact with name when available (skip pure group jids as contact phones)
      if (!peer.isGroup && contactPhone) {
        try {
          const existing = await db('contacts')
            .where({ phone: contactPhone, assigned_ws_account_id: accountId })
            .first();
          if (!existing) {
            await db('contacts').insert({
              phone: contactPhone,
              name: pushName || null,
              assigned_ws_account_id: accountId,
              source: msg.key.fromMe ? 'desk_out' : 'inbound',
              opted_in: true,
            });
          } else if (pushName && !existing.name) {
            await db('contacts').where({ id: existing.id }).update({ name: pushName, updated_at: db.fn.now() });
          }
        } catch (e) { /* ignore dups */ }
      }

      io.emit('wa:message', {
        accountId,
        phone: contactPhone,
        name: pushName || convo.contact_name || null,
        displayId: peer.displayId,
        isLid: peer.isLid,
        direction: msg.key.fromMe ? 'out' : 'in',
        text,
        timestamp: msg.messageTimestamp ? Number(msg.messageTimestamp) : Date.now(),
        fromMe: !!msg.key.fromMe,
        isGroup: peer.isGroup,
      });

      logger.info('Message persisted + broadcast', {
        accountId,
        phone: contactPhone,
        name: pushName || null,
        isLid: peer.isLid,
        direction: msg.key.fromMe ? 'out' : 'in'
      });
    } catch (e) {
      logger.error('Failed to persist incoming message', { error: e.message });
    }
  }
});

// Graceful shutdown — end sockets WITHOUT logout so WhatsApp keeps the linked device
async function gracefulShutdown(signal) {
  logger.info(`${signal}: shutting down (keeping WA multi-device links)...`);
  if (warmingWorker) await warmingWorker.close().catch(() => {});
  if (blastWorker) await blastWorker.close().catch(() => {});
  if (groupPullWorker) await groupPullWorker.close().catch(() => {});
  // Soft stop only — do not logout / clear auth / mark error
  await sessionManager.shutdownAll().catch(() => {});
  // Keep status as linked in DB for accounts that were linked
  await db('ws_accounts')
    .whereIn('status', ['offline', 'error', 'linking'])
    .whereNotNull('baileys_auth_state')
    .update({ status: 'linked', updated_at: db.fn.now() })
    .catch(() => {});
  await closeQueues().catch(() => {});
  process.exit(0);
}
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Restore linked sessions after boot so closing the browser does not kill WA links
setTimeout(async () => {
  try {
    const linked = await db('ws_accounts')
      .whereIn('status', ['linked', 'active'])
      .whereNotNull('baileys_auth_state')
      .select('id', 'phone');
    logger.info(`Restoring ${linked.length} linked session(s)...`);
    for (const acc of linked) {
      try {
        await sessionEngine.connectAccount(acc.id);
        logger.info(`Restored session ${acc.phone}`);
      } catch (e) {
        logger.warn(`Restore failed for ${acc.phone}: ${e.message}`);
        // Stay linked in DB — transient network should not flip to error
      }
    }
  } catch (e) {
    logger.warn('Session restore skipped: ' + e.message);
  }
}, 2500);

// Socket.io placeholder (will attach real handlers in realtime/ )
io.on('connection', (socket) => {
  logger.info('Socket connected (placeholder)', { id: socket.id });
  socket.on('disconnect', () => logger.info('Socket disconnected', { id: socket.id }));
});

// Attach io to app for routes/services if needed
app.set('io', io);

// Make DB optional for early bootstrap (health + basic routes work)
const port = config.PORT;
httpServer.listen(port, () => {
  logger.info(`🚀 WA Control server running on port ${port} [${config.NODE_ENV}]`);
  logger.info('   See TASKS.md for the full agent-assignable implementation plan.');
  logger.info('   Progress: Phase 0-3 core + 4 warming + 6.1-6.2 materials+blasts(fan+cold) + 7.1 group-pulls + 8 desk + contacts + live at /');
  logger.info('   Login: supervisor@local / admin123 | UI: http://localhost:3000');
});

export { app, io, db };
