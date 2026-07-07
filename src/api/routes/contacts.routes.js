import { Router } from 'express';
import { listContacts, importContacts, cleanContacts } from '../controllers/contacts.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/contacts', authenticate, listContacts);
router.post('/contacts/import', authenticate, requireRole('supervisor'), importContacts);
router.post('/contacts/clean', authenticate, requireRole('supervisor'), cleanContacts);

export default router;
