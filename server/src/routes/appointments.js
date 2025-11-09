import { Router } from 'express';
import { query } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// List appointments
router.get('/', requireAuth, async (_req, res) => {
  const { rows } = await query(
    `SELECT a.id, a.patient_id, a.doctor_id, a.date, a.time, a.status,
            p.name AS patient_name
       FROM appointments a
       JOIN patients p ON p.id = a.patient_id
      ORDER BY a.date DESC, a.time DESC`
  );
  res.json(rows);
});

// Create appointment
router.post('/', requireAuth, async (req, res) => {
  const { patient_id, doctor_id, date, time, status } = req.body || {};
  if (!patient_id || !date || !time) return res.status(400).json({ error: 'patient_id, date, time required' });
  const { rows } = await query(
    'INSERT INTO appointments (patient_id, doctor_id, date, time, status) VALUES ($1, $2, $3, $4, $5) RETURNING id, patient_id, doctor_id, date, time, status',
    [patient_id, doctor_id || null, date, time, status || 'scheduled']
  );
  res.status(201).json(rows[0]);
});

export default router;


