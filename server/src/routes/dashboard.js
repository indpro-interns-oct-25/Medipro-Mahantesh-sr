import { Router } from 'express';
import { query } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Get dashboard stats
router.get('/', requireAuth, async (_req, res) => {
  try {
    // Get counts
    const [patientsCount, appointmentsCount, usersCount, todayAppts] = await Promise.all([
      query('SELECT COUNT(*) as count FROM patients'),
      query('SELECT COUNT(*) as count FROM appointments'),
      query('SELECT COUNT(*) as count FROM users'),
      query(
        `SELECT a.id, a.patient_id, a.doctor_id, a.date, a.time, a.status,
                p.name AS patient_name
           FROM appointments a
           JOIN patients p ON p.id = a.patient_id
          WHERE a.date = CURRENT_DATE
          ORDER BY a.time ASC`
      )
    ]);

    res.json({
      stats: {
        totalPatients: Number(patientsCount.rows[0].count),
        totalAppointments: Number(appointmentsCount.rows[0].count),
        totalUsers: Number(usersCount.rows[0].count)
      },
      todayAppointments: todayAppts.rows
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

export default router;

