import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../../config/index.js';
import db from '../../db/connection.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

function generateAccess(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    config.JWT_SECRET,
    { expiresIn: config.JWT_ACCESS_EXPIRES_IN }
  );
}

router.post('/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    const user = await db('users').where({ email, is_active: true }).first();
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateAccess(user);
    // TODO: implement refresh token storage per 0.4
    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, token });
  } catch (e) { next(e); }
});

router.get('/auth/me', authenticate, async (req, res) => {
  const user = await db('users')
    .select('id', 'email', 'name', 'role', 'is_active')
    .where({ id: req.user.id })
    .first();
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

// Supervisor creates agents (basic for 0.4)
router.post('/auth/agents', authenticate, requireRole('supervisor'), async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) return res.status(400).json({ error: 'email, password, name required' });

    const hash = await bcrypt.hash(password, 12);
    const [user] = await db('users')
      .insert({
        email,
        password_hash: hash,
        name,
        role: 'agent',
        is_active: true,
      })
      .returning(['id', 'email', 'name', 'role']);
    res.status(201).json({ user });
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'Email already exists' });
    next(e);
  }
});

export default router;
