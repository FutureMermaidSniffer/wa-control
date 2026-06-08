import { Router } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import config from '../../config/index.js';
import { listMaterials, createMaterial, deleteMaterial } from '../controllers/materials.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

// Multer memory for processing (avatars resized with sharp, saved to UPLOAD_DIR)
const upload = multer({ storage: multer.memoryStorage() });

router.get('/materials', authenticate, listMaterials);

// Support file upload for avatars (type=avatar + file field)
router.post('/materials', authenticate, requireRole('supervisor'), upload.single('file'), createMaterial);
router.delete('/materials/:id', authenticate, requireRole('supervisor'), deleteMaterial);

export default router;
