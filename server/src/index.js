import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createPool } from './lib/db.js';
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import patientsRoutes from './routes/patients.js';
import appointmentsRoutes from './routes/appointments.js';
import dashboardRoutes from './routes/dashboard.js';
import medicalRecordsRoutes from './routes/medicalRecords.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json());

// Health
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'medicare-pro', time: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/patients', patientsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/medical-records', medicalRecordsRoutes);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.path });
});

// Start server after DB pool created
createPool()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server due to DB error:', err);
    process.exit(1);
  });


