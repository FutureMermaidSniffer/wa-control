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

export default router;
