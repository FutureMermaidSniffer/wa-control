import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import sharp from 'sharp';
import config from '../../config/index.js';
import materialsData from '../../data/materials.data.js';
import profilePoolsData from '../../data/profilePools.data.js';

async function saveAvatarFile(file) {
  const uploadDir = config.UPLOAD_DIR || './uploads';
  await fs.mkdir(uploadDir, { recursive: true }).catch(() => {});
  const filename = `avatar-${crypto.randomBytes(8).toString('hex')}.jpg`;
  const filepath = path.join(uploadDir, filename);
  await sharp(file.buffer)
    .resize(512, 512, { fit: 'cover' })
    .jpeg({ quality: 85 })
    .toFile(filepath);
  return { filename, mime_type: 'image/jpeg' };
}

async function saveAudioFile(file) {
  const uploadDir = config.UPLOAD_DIR || './uploads';
  await fs.mkdir(uploadDir, { recursive: true }).catch(() => {});
  const ext = (path.extname(file.originalname || '') || '.ogg').replace(/[^\w.]/g, '') || '.ogg';
  const filename = `audio-${crypto.randomBytes(8).toString('hex')}${ext}`;
  const filepath = path.join(uploadDir, filename);
  await fs.writeFile(filepath, file.buffer);
  return { filename, mime_type: file.mimetype || 'audio/ogg' };
}

async function unlinkMaterialFile(mat) {
  if (!mat?.content) return;
  if (mat.type !== 'avatar' && mat.type !== 'audio') return;
  if (String(mat.content).startsWith('http')) return;
  const uploadDir = config.UPLOAD_DIR || './uploads';
  const filepath = path.join(uploadDir, mat.content);
  await fs.unlink(filepath).catch(() => {});
}

// ---------- Materials ----------

export async function listMaterials(req, res, next) {
  try {
    const data = await materialsData.listMaterials({
      type: req.query.type,
      active: req.query.active,
      pool_id: req.query.pool_id,
    });
    res.json({ data });
  } catch (e) { next(e); }
}

export async function getMaterial(req, res, next) {
  try {
    const mat = await materialsData.getMaterial(req.params.id);
    if (!mat) return res.status(404).json({ error: 'Material not found' });
    res.json({ data: mat });
  } catch (e) { next(e); }
}

export async function createMaterial(req, res, next) {
  try {
    const { type, name, content, notes, is_active } = req.body;
    let finalContent = content;
    let mime_type = null;

    if (type === 'avatar' && req.file) {
      const saved = await saveAvatarFile(req.file);
      finalContent = saved.filename;
      mime_type = saved.mime_type;
    } else if (type === 'audio' && req.file) {
      const saved = await saveAudioFile(req.file);
      finalContent = saved.filename;
      mime_type = saved.mime_type;
    }

    if (!type || !finalContent) {
      return res.status(400).json({ error: 'type and content (or file for avatar/audio) required' });
    }

    const mat = await materialsData.createMaterial({
      type,
      name: name || (type === 'avatar' ? 'uploaded-avatar' : type === 'audio' ? 'uploaded-audio' : 'untitled'),
      content: finalContent,
      mime_type: mime_type || (req.file ? req.file.mimetype : null),
      notes: notes || null,
      is_active: is_active === false || is_active === 'false' ? false : true,
      created_by: req.user?.id,
    });

    // Auto-attach to default pool for nickname/avatar/about so warming sees new assets
    if (['nickname', 'avatar', 'about', 'status'].includes(type)) {
      const def = await profilePoolsData.getDefaultPoolWithMaterials().catch(() => null);
      if (def?.id) {
        await profilePoolsData.addItems(def.id, [mat.id]).catch(() => {});
      }
    }

    res.status(201).json({ data: mat });
  } catch (e) { next(e); }
}

export async function updateMaterial(req, res, next) {
  try {
    const existing = await materialsData.getMaterial(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Material not found' });

    const { name, content, type, notes, is_active } = req.body;
    const patch = {};
    if (name !== undefined) patch.name = name;
    if (content !== undefined) patch.content = content;
    if (type !== undefined) patch.type = type;
    if (notes !== undefined) patch.notes = notes;
    if (is_active !== undefined) {
      patch.is_active = !(is_active === false || is_active === 'false' || is_active === 0 || is_active === '0');
    }

    const matType = type || existing.type;
    if (req.file) {
      if (matType === 'avatar') {
        const saved = await saveAvatarFile(req.file);
        await unlinkMaterialFile(existing);
        patch.content = saved.filename;
        patch.mime_type = saved.mime_type;
      } else if (matType === 'audio') {
        const saved = await saveAudioFile(req.file);
        await unlinkMaterialFile(existing);
        patch.content = saved.filename;
        patch.mime_type = saved.mime_type;
      }
    }

    if (!Object.keys(patch).length) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const mat = await materialsData.updateMaterial(req.params.id, patch);
    res.json({ data: mat });
  } catch (e) { next(e); }
}

export async function deleteMaterial(req, res, next) {
  try {
    const mat = await materialsData.getMaterial(req.params.id);
    if (mat) await unlinkMaterialFile(mat);
    await materialsData.deleteMaterial(req.params.id);
    res.json({ success: true });
  } catch (e) { next(e); }
}

// ---------- Profile pools ----------

export async function listPools(req, res, next) {
  try {
    const data = await profilePoolsData.listPools();
    res.json({ data });
  } catch (e) { next(e); }
}

export async function getPool(req, res, next) {
  try {
    const pool = await profilePoolsData.getPool(req.params.id);
    if (!pool) return res.status(404).json({ error: 'Pool not found' });
    res.json({ data: pool });
  } catch (e) { next(e); }
}

export async function createPool(req, res, next) {
  try {
    const { name, description, is_default, is_active } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'name required' });
    const pool = await profilePoolsData.createPool({
      name: name.trim(),
      description,
      is_default: !!is_default,
      is_active,
      created_by: req.user?.id,
    });
    res.status(201).json({ data: pool });
  } catch (e) { next(e); }
}

export async function updatePool(req, res, next) {
  try {
    const { name, description, is_default, is_active } = req.body;
    const patch = {};
    if (name !== undefined) patch.name = String(name).trim();
    if (description !== undefined) patch.description = description;
    if (is_default !== undefined) patch.is_default = !!is_default;
    if (is_active !== undefined) patch.is_active = !!is_active;
    if (!Object.keys(patch).length) return res.status(400).json({ error: 'No fields to update' });

    const pool = await profilePoolsData.updatePool(req.params.id, patch);
    if (!pool) return res.status(404).json({ error: 'Pool not found' });
    res.json({ data: pool });
  } catch (e) { next(e); }
}

export async function setDefaultPool(req, res, next) {
  try {
    const pool = await profilePoolsData.setDefaultPool(req.params.id);
    if (!pool) return res.status(404).json({ error: 'Pool not found' });
    res.json({ data: pool });
  } catch (e) { next(e); }
}

export async function deletePool(req, res, next) {
  try {
    const result = await profilePoolsData.deletePool(req.params.id);
    if (!result.deleted) return res.status(404).json({ error: 'Pool not found' });
    res.json({ success: true });
  } catch (e) { next(e); }
}

export async function addPoolItems(req, res, next) {
  try {
    const pool = await profilePoolsData.getPool(req.params.id);
    if (!pool) return res.status(404).json({ error: 'Pool not found' });
    const ids = req.body.material_ids || req.body.materialIds || [];
    if (!Array.isArray(ids) || !ids.length) {
      return res.status(400).json({ error: 'material_ids array required' });
    }
    const result = await profilePoolsData.addItems(req.params.id, ids);
    const updated = await profilePoolsData.getPool(req.params.id);
    res.json({ data: updated, ...result });
  } catch (e) { next(e); }
}

export async function removePoolItem(req, res, next) {
  try {
    const result = await profilePoolsData.removeItem(req.params.id, req.params.materialId);
    res.json({ success: true, ...result });
  } catch (e) { next(e); }
}
