import { Router } from 'express';
import { query } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Get all medical records for a patient
router.get('/patient/:patientId', requireAuth, async (req, res) => {
  const patientId = Number(req.params.patientId);
  const { rows } = await query(
    `SELECT mr.id, mr.patient_id, mr.doctor_id, mr.notes, mr.created_at, mr.updated_at,
            u.name AS doctor_name
       FROM medical_records mr
       LEFT JOIN users u ON u.id = mr.doctor_id
      WHERE mr.patient_id = $1
      ORDER BY mr.created_at DESC`,
    [patientId]
  );
  res.json(rows);
});

// Create new medical record
router.post('/', requireAuth, async (req, res) => {
  const { patient_id, doctor_id, notes } = req.body || {};
  if (!patient_id || !notes) {
    return res.status(400).json({ error: 'patient_id and notes are required' });
  }
  const { rows } = await query(
    `INSERT INTO medical_records (patient_id, doctor_id, notes)
     VALUES ($1, $2, $3)
     RETURNING id, patient_id, doctor_id, notes, created_at, updated_at`,
    [patient_id, doctor_id || req.user.id, notes]
  );
  res.status(201).json(rows[0]);
});

// Update medical record
router.put('/:id', requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const { notes } = req.body || {};
  if (!notes) return res.status(400).json({ error: 'notes required' });
  const { rows } = await query(
    `UPDATE medical_records
     SET notes = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING id, patient_id, doctor_id, notes, created_at, updated_at`,
    [notes, id]
  );
  const updated = rows[0];
  if (!updated) return res.status(404).json({ error: 'Medical record not found' });
  res.json(updated);
});

// Delete medical record
router.delete('/:id', requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  await query('DELETE FROM medical_records WHERE id = $1', [id]);
  res.json({ ok: true });
});

export default router;

