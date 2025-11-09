import { Router } from 'express';
import { query } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// List patients
router.get('/', requireAuth, async (_req, res) => {
  const { rows } = await query('SELECT id, name, email, phone, doctor_id FROM patients ORDER BY id DESC');
  res.json(rows);
});

// Create patient
router.post('/', requireAuth, async (req, res) => {
  const { name, email, phone, doctor_id } = req.body || {};
  if (!name) return res.status(400).json({ error: 'Name required' });
  const { rows } = await query(
    'INSERT INTO patients (name, email, phone, doctor_id) VALUES ($1, $2, $3, $4) RETURNING id, name, email, phone, doctor_id',
    [name, email || null, phone || null, doctor_id || null]
  );
  res.status(201).json(rows[0]);
});

// Get by id
router.get('/:id', requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const { rows } = await query('SELECT id, name, email, phone, doctor_id FROM patients WHERE id=$1', [id]);
  const patient = rows[0];
  if (!patient) return res.status(404).json({ error: 'Patient not found' });
  // also fetch appointments
  const appts = await query(
    'SELECT id, patient_id, doctor_id, date, time, status FROM appointments WHERE patient_id=$1 ORDER BY date DESC, time DESC',
    [id]
  );
  res.json({ ...patient, appointments: appts.rows });
});

// Update
router.put('/:id', requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const { name, email, phone, doctor_id } = req.body || {};
  const { rows } = await query(
    'UPDATE patients SET name=$1, email=$2, phone=$3, doctor_id=$4 WHERE id=$5 RETURNING id, name, email, phone, doctor_id',
    [name, email, phone, doctor_id, id]
  );
  const updated = rows[0];
  if (!updated) return res.status(404).json({ error: 'Patient not found' });
  res.json(updated);
});

// Delete (optional)
router.delete('/:id', requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  await query('DELETE FROM patients WHERE id=$1', [id]);
  res.json({ ok: true });
});

export default router;


