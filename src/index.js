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

// Jobs / workers (BullMQ + Redis)
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

// Attach session manager for use in realtime / jobs later
import SessionManager from './core/sessions/SessionManager.js';
import { setSessionManager } from './api/controllers/sessions.controller.js';
const sessionManager = new SessionManager(db);
app.set('sessionManager', sessionManager);
setSessionManager(sessionManager);

// Wire SessionManager events to Socket.io so the Supervisor desk can show live QR / connection status
// (this is the beginning of the realtime desk experience)
sessionManager.on('qr', ({ accountId, phone, qr }) => {
  io.emit('wa:qr', { accountId, phone, qr });
});

// Support for phone-less / cloud emulator linking via pairing code
sessionManager.on('pairing_code', ({ accountId, phone, code }) => {
  io.emit('wa:pairing_code', { accountId, phone, code });
});
sessionManager.on('connected', ({ accountId, phone }) => {
  io.emit('wa:connected', { accountId, phone });
});
sessionManager.on('disconnected', (payload) => {
  io.emit('wa:disconnected', payload);
});

// Persist incoming/outgoing messages from Baileys + update conversations + broadcast live
sessionManager.on('messages.upsert', async ({ accountId, messages }) => {
  for (const msg of (messages || [])) {
    try {
      const remoteJid = msg.key?.remoteJid;
      if (!remoteJid) continue;

      const isGroup = remoteJid.includes('@g.us');
      const contactPhone = isGroup ? remoteJid : remoteJid.replace(/@.*/, '');
      // Groups are now passed through (for 拉群 desk + future group chat). Conversation key uses full jid for groups.
      const text = msg.message?.conversation ||
                   msg.message?.extendedTextMessage?.text ||
                   (msg.message?.imageMessage ? '[image]' : '') ||
                   (msg.message?.videoMessage ? '[video]' : '');

      if (!text) continue;

      const convo = await messagesData.findOrCreateConversation(accountId, contactPhone);

      await messagesData.createMessage({
        conversation_id: convo.id,
        ws_account_id: accountId,
        direction: msg.key.fromMe ? 'out' : 'in',
        text,
        wa_message_id: msg.key?.id,
        timestamp: msg.messageTimestamp ? new Date(Number(msg.messageTimestamp) * 1000) : new Date(),
        raw: { key: msg.key, message: msg.message },
      });

      // Auto-capture / assign contact (fan) for this WS number on any message
      try {
        await db('contacts')
          .insert({
            phone: contactPhone,
            assigned_ws_account_id: accountId,
            source: msg.key.fromMe ? 'desk_out' : 'inbound',
            opted_in: true,
          })
          .onConflict(['phone', 'assigned_ws_account_id'])
          .ignore();
      } catch (e) { /* ignore dups */ }

      // Broadcast for live desk UI (future: rooms per account)
      io.emit('wa:message', {
        accountId,
        phone: contactPhone,
        direction: msg.key.fromMe ? 'out' : 'in',
        text,
        timestamp: msg.messageTimestamp ? Number(msg.messageTimestamp) : Date.now(),
        fromMe: !!msg.key.fromMe,
        isGroup,
      });

      logger.info('Message persisted + broadcast', {
        accountId,
        phone: contactPhone,
        direction: msg.key.fromMe ? 'out' : 'in'
      });
    } catch (e) {
      logger.error('Failed to persist incoming message', { error: e.message });
    }
  }
});

// Graceful shutdown of WA sessions + jobs
process.on('SIGINT', async () => {
  logger.info('Shutting down sessions and jobs...');
  if (warmingWorker) await warmingWorker.close().catch(() => {});
  if (blastWorker) await blastWorker.close().catch(() => {});
  if (groupPullWorker) await groupPullWorker.close().catch(() => {});
  await sessionManager.shutdownAll().catch(() => {});
  await closeQueues().catch(() => {});
  process.exit(0);
});

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
  logger.info('   Progress: Phase 0-3 core + 4 warming + 6.1-6.2 materials+blasts(fan+cold) + 7.1 拉群/group-pulls + 8 desk + contacts + live at /');
  logger.info('   Login: supervisor@local / admin123 | UI: http://localhost:3000');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down...');
  httpServer.close(() => process.exit(0));
});

export { app, io, db };
