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

// Bulk import from uploaded/proxy credential text file
// Body: { text: "full file contents", defaultType?: "socks5"|"http", namePrefix?: string, region?: string }
router.post('/proxies/import', authenticate, requireRole('supervisor'), importProxies);

/**
 * Quick-add a single proxy from a URL string. Returns the proxy ID immediately.
 * Body: { "url": "http://148.113.193.96:5959" }  or  { "url": "socks5://user:pass@host:port" }
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
