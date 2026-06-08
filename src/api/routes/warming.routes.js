import { Router } from 'express';
import {
  listWarming,
  enterWarmingPool,
  updateWarmingTask,
  pauseWarming,
} from '../controllers/warming.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/warming/tasks', authenticate, listWarming);
router.post('/warming/enter', authenticate, requireRole('supervisor'), enterWarmingPool);
router.patch('/warming/tasks/:id', authenticate, requireRole('supervisor'), updateWarmingTask);
router.post('/warming/tasks/:id/pause', authenticate, requireRole('supervisor'), pauseWarming);

export default router;
