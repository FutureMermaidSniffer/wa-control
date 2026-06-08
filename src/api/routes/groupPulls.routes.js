import { Router } from 'express';
import {
  listGroupPulls,
  getGroupPull,
  createGroupPullTask,
  executeGroupPull,
  addMembersToPull,
  updateGroupPullStatus,
} from '../controllers/groupPulls.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

// Read access for supervisor + agents (desk may surface groups later)
router.get('/group-pulls', authenticate, listGroupPulls);
router.get('/group-pulls/:id', authenticate, getGroupPull);

// Supervisor actions for creating + executing pulls (matches PDF "privileged add" flows)
router.post('/group-pulls', authenticate, requireRole('supervisor'), createGroupPullTask);
router.post('/group-pulls/:id/execute', authenticate, requireRole('supervisor'), executeGroupPull);
router.post('/group-pulls/:id/add-members', authenticate, requireRole('supervisor'), addMembersToPull);
router.patch('/group-pulls/:id/status', authenticate, requireRole('supervisor'), updateGroupPullStatus);

export default router;
