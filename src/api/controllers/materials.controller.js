import db from '../../db/connection.js';
import config from '../../config/index.js';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';

export async function listMaterials(req, res, next) {
  try {
    const { type } = req.query;
    let q = db('materials').select('*').orderBy('created_at', 'desc');
    if (type) q = q.where({ type });
    res.json({ data: await q });
  } catch (e) { next(e); }
}

export async function createMaterial(req, res, next) {
  try {
    const { type, name, content } = req.body;
    let finalContent = content;

    // Handle avatar file upload: resize with sharp, save to UPLOAD_DIR
    if (type === 'avatar' && req.file) {
      const uploadDir = config.UPLOAD_DIR || './uploads';
      await fs.mkdir(uploadDir, { recursive: true }).catch(() => {});

      const ext = 'jpg'; // normalize to jpg for avatars
      const filename = `avatar-${crypto.randomBytes(8).toString('hex')}.${ext}`;
      const filepath = path.join(uploadDir, filename);

      // Resize to square ~512px, good for WA profile pics
      await sharp(req.file.buffer)
        .resize(512, 512, { fit: 'cover' })
        .jpeg({ quality: 85 })
        .toFile(filepath);

      finalContent = filename; // store just the filename; warming uses ./uploads/ + name
    }

    if (!type || !finalContent) return res.status(400).json({ error: 'type and content (or file for avatar) required' });

    const [mat] = await db('materials')
      .insert({
        type,
        name: name || (type === 'avatar' ? 'uploaded-avatar' : 'untitled'),
        content: finalContent,
        mime_type: req.file ? req.file.mimetype : null,
        created_by: req.user?.id,
      })
      .returning('*');
    res.status(201).json({ data: mat });
  } catch (e) { next(e); }
}

export async function deleteMaterial(req, res, next) {
  try {
    // Optional: delete file from disk for avatars
    const mat = await db('materials').where({ id: req.params.id }).first();
    if (mat && mat.type === 'avatar' && mat.content) {
      const uploadDir = config.UPLOAD_DIR || './uploads';
      const filepath = path.join(uploadDir, mat.content);
      await fs.unlink(filepath).catch(() => {});
    }
    await db('materials').where({ id: req.params.id }).del();
    res.json({ success: true });
  } catch (e) { next(e); }
}
