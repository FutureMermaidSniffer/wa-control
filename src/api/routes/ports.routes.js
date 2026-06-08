import { Router } from 'express';
import { listPorts, purchasePort, getPort } from '../controllers/ports.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/ports', authenticate, listPorts);
router.post('/ports/purchase', authenticate, requireRole('supervisor'), purchasePort);
router.get('/ports/:id', authenticate, getPort);

export default router;
