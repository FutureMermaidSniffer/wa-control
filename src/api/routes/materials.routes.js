import { Router } from 'express';
import multer from 'multer';
import {
  listMaterials,
  getMaterial,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  listPools,
  getPool,
  createPool,
  updatePool,
  setDefaultPool,
  deletePool,
  addPoolItems,
  removePoolItem,
} from '../controllers/materials.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 12 * 1024 * 1024 } });

// Profile pools (declare before /materials/:id)
router.get('/materials/pools', authenticate, listPools);
router.get('/materials/pools/:id', authenticate, getPool);
router.post('/materials/pools', authenticate, requireRole('supervisor'), createPool);
router.patch('/materials/pools/:id', authenticate, requireRole('supervisor'), updatePool);
router.post('/materials/pools/:id/set-default', authenticate, requireRole('supervisor'), setDefaultPool);
router.delete('/materials/pools/:id', authenticate, requireRole('supervisor'), deletePool);
router.post('/materials/pools/:id/items', authenticate, requireRole('supervisor'), addPoolItems);
router.delete(
  '/materials/pools/:id/items/:materialId',
  authenticate,
  requireRole('supervisor'),
  removePoolItem,
);

// Materials library
router.get('/materials', authenticate, listMaterials);
router.get('/materials/:id', authenticate, getMaterial);
router.post(
  '/materials',
  authenticate,
  requireRole('supervisor'),
  upload.single('file'),
  createMaterial,
);
router.patch(
  '/materials/:id',
  authenticate,
  requireRole('supervisor'),
  upload.single('file'),
  updateMaterial,
);
router.delete('/materials/:id', authenticate, requireRole('supervisor'), deleteMaterial);

export default router;
