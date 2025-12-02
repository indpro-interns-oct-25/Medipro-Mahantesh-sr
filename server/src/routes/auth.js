import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { query } from '../lib/db.js';
import { comparePassword } from '../utils/crypto.js';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const result = await query('SELECT id, name, email, password_hash, role FROM users WHERE email=$1', [email]);
  const user = result.rows[0];
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await comparePassword(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const payload = { id: user.id, name: user.name, email: user.email, role: user.role };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
  res.json({ token, user: payload });
});

router.post('/logout', (_req, res) => {
  // Client should discard token; server is stateless
  res.json({ ok: true });
});

export default router;


