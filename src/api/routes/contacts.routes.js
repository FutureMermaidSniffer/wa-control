import { Router } from 'express';
import { listContacts, importContacts } from '../controllers/contacts.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/contacts', authenticate, listContacts);
router.post('/contacts/import', authenticate, requireRole('supervisor'), importContacts);

export default router;
