import { Router } from 'express';
import {
  listProxies,
  createProxy,
  getProxy,
  updateProxy,
  deleteProxy,
  testProxy,
  runHealthCheck,
  importProxies,
  quickAddProxy,
  bulkAssignProxy,
} from '../controllers/proxies.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/proxies', authenticate, listProxies);
router.post('/proxies', authenticate, requireRole('supervisor'), createProxy);
router.get('/proxies/:id', authenticate, getProxy);
router.put('/proxies/:id', authenticate, requireRole('supervisor'), updateProxy);
router.delete('/proxies/:id', authenticate, requireRole('supervisor'), deleteProxy);

router.post('/proxies/:id/test', authenticate, requireRole('supervisor'), testProxy);
router.post('/proxies/health-check', authenticate, requireRole('supervisor'), runHealthCheck);

// Bulk import from paste or .txt — auto-detects per line:
//   ip:port | ip:port:username:password | USERNAME:PASSWORD@IP:PORT
// Body: { text, defaultType?: "socks5"|"http", namePrefix?: string, region?: string }
router.post('/proxies/import', authenticate, requireRole('supervisor'), importProxies);

/**
 * Quick-add a single proxy line. Returns the proxy ID immediately.
 * Accepts: ip:port · ip:port:user:pass · user:pass@ip:port (optional socks5://|http://)
 * Body: { "url": "user:pass@host:port", "type"?: "socks5" }
 * Use the returned proxyId in POST /sessions/connect to route Baileys through it.
 */
router.post('/proxies/quick-add', authenticate, requireRole('supervisor'), quickAddProxy);

/**
 * Assign a proxy to multiple accounts in one call.
 * Body: { "proxyId": "<uuid>", "accountIds": ["uuid", ...], "overwrite": false }
 * If accountIds is omitted: assigns to ALL accounts currently without a proxy.
 */
router.post('/proxies/bulk-assign', authenticate, requireRole('supervisor'), bulkAssignProxy);

export default router;
