import jwt from 'jsonwebtoken';
import config from '../../config/index.js';
import db from '../../db/connection.js';

/**
 * Authenticate JWT middleware.
 * Attaches req.user = { id, email, role }
 */
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, config.JWT_SECRET);
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
}

/**
 * Require specific role(s).
 * e.g. requireRole('supervisor') or requireRole(['supervisor', 'admin'])
 */
export function requireRole(roles) {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    if (!allowed.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient role' });
    }
    next();
  };
}

/**
 * Require a permission key.
 * For v1: supervisor always allowed. Agents check against simple mapping or DB later.
 * For now, use a basic allow-list per role. Extend with real role_permissions.
 */
const ROLE_PERMISSIONS = {
  supervisor: '*', // everything
  admin: '*',
  agent: [
    'desk.chat',
    'desk.view',
    'sessions.view',
    'contacts.view',
    'materials.view',
    'blasts.fan', // qualified only initially
  ],
};

export function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

    const rolePerms = ROLE_PERMISSIONS[req.user.role];
    if (rolePerms === '*') return next();

    if (Array.isArray(rolePerms) && rolePerms.includes(permission)) {
      return next();
    }

    // Fallback: allow supervisor via DB check later, but for now log
    return res.status(403).json({ error: `Missing permission: ${permission}` });
  };
}

export default { authenticate, requireRole, requirePermission };
