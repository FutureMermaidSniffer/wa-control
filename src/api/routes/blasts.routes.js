import { Router } from 'express';
import {
  listCampaigns,
  getCampaign,
  createFanBlast,
  createColdBlast,
  updateCampaignStatus,
  exportUnsent,
} from '../controllers/blasts.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/blasts', authenticate, listCampaigns);
router.get('/blasts/:id', authenticate, getCampaign);
router.post('/blasts/fan', authenticate, requireRole('supervisor'), createFanBlast);
router.post('/blasts/cold', authenticate, requireRole('supervisor'), createColdBlast);
router.patch('/blasts/:id/status', authenticate, requireRole('supervisor'), updateCampaignStatus);
router.get('/blasts/:id/unsent', authenticate, requireRole(['supervisor', 'agent']), exportUnsent);

export default router;