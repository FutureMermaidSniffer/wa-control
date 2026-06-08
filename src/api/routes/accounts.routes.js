import { Router } from 'express';
import {
  listAccounts,
  getAccount,
  importAccounts,
  updateAccount,
  moveToWarehouse,
  deleteAccount,
} from '../controllers/accounts.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/accounts', authenticate, listAccounts);
router.get('/accounts/:id', authenticate, getAccount);
router.post('/accounts/import', authenticate, requireRole('supervisor'), importAccounts);
router.patch('/accounts/:id', authenticate, requireRole(['supervisor', 'agent']), updateAccount);
router.post('/accounts/:id/warehouse', authenticate, requireRole('supervisor'), moveToWarehouse);
router.delete('/accounts/:id', authenticate, requireRole('supervisor'), deleteAccount);

export default router;
