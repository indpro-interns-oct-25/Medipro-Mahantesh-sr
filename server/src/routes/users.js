import { Router } from 'express';
import { query } from '../lib/db.js';
import { hashPassword } from '../utils/crypto.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// Admin: list users
router.get('/', requireAuth, requireRole('admin'), async (_req, res) => {
  const { rows } = await query('SELECT id, name, email, role FROM users ORDER BY id');
  res.json(rows);
});

// Admin: create user
router.post('/', requireAuth, requireRole('admin'), async (req, res) => {
  const { name, email, password, role } = req.body || {};
  if (!name || !email || !password || !role) return res.status(400).json({ error: 'Missing fields' });
  const passwordHash = await hashPassword(password);
  try {
    const { rows } = await query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, passwordHash, role]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'Email already exists' });
    throw e;
  }
});

export default router;


