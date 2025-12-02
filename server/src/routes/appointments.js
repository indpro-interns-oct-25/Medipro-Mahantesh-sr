import { Router } from 'express';
import { query } from '../lib/db.js';
import { requireAuth,requireRole} from '../middleware/auth.js';

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
router.post('/', requireAuth, requireRole("doctor","receptionist"), async (req, res) => {
  const { patient_id, doctor_id, date, time, status } = req.body || {};
  if (!patient_id || !date || !time) return res.status(400).json({ error: 'patient_id, date, time required' });
  const { rows } = await query(
    'INSERT INTO appointments (patient_id, doctor_id, date, time, status) VALUES ($1, $2, $3, $4, $5) RETURNING id, patient_id, doctor_id, date, time, status',
    [patient_id, doctor_id || null, date, time, status || 'scheduled']
  );
  res.status(201).json(rows[0]);
});

// Update appointment (status and/or date/time/doctor)
router.patch('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { status, date, time, doctor_id } = req.body || {};

  // Build dynamic update based on provided fields
  const fields = [];
  const values = [];

  const allowedStatuses = new Set(['scheduled', 'completed', 'cancelled', 'pending', 'in_progress']);

  if (typeof status !== 'undefined') {
    const normalized = String(status).toLowerCase();
    if (!allowedStatuses.has(normalized)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    fields.push(`status = $${fields.length + 1}`);
    values.push(normalized);
  }
  if (typeof date !== 'undefined') {
    fields.push(`date = $${fields.length + 1}`);
    values.push(date);
  }
  if (typeof time !== 'undefined') {
    fields.push(`time = $${fields.length + 1}`);
    values.push(time);
  }
  if (typeof doctor_id !== 'undefined') {
    fields.push(`doctor_id = $${fields.length + 1}`);
    values.push(doctor_id || null);
  }

  if (fields.length === 0) {
    return res.status(400).json({ error: 'No updatable fields provided' });
  }

  values.push(id);
  const setClause = fields.join(', ');
  const { rows } = await query(
    `UPDATE appointments SET ${setClause} WHERE id = $${values.length} RETURNING id, patient_id, doctor_id, date, time, status`,
    values
  );

  if (!rows[0]) return res.status(404).json({ error: 'Appointment not found' });
  res.json(rows[0]);
});

export default router;


