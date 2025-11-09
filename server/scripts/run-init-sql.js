import fs from 'fs';
import path from 'path';
import url from 'url';
import dotenv from 'dotenv';
import pg from 'pg';
import bcrypt from 'bcryptjs';

dotenv.config();

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const sqlPath = path.join(__dirname, 'init.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');

const run = async () => {
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    // Ensure tables
    await client.query(sql);

    // Seed users with proper bcrypt hash for 'password123'
    const passwordHash = await bcrypt.hash('password123', 10);
    const users = [
      { name: 'Admin User', email: 'admin@example.com', role: 'admin' },
      { name: 'Dr. Strange', email: 'doctor@example.com', role: 'doctor' },
      { name: 'Front Desk', email: 'reception@example.com', role: 'receptionist' }
    ];
    for (const u of users) {
      await client.query(
        `INSERT INTO users (name, email, password_hash, role)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role`,
        [u.name, u.email, passwordHash, u.role]
      );
    }

    // Fetch doctor id for sample data
    const docRes = await client.query('SELECT id FROM users WHERE email=$1', ['doctor@example.com']);
    const doctorId = docRes.rows[0]?.id || null;

    // Seed patients
    const patients = [
      { name: 'John Doe', email: 'john@example.com', phone: '+11234567890' },
      { name: 'Jane Smith', email: 'jane@example.com', phone: '+11234567891' },
      { name: 'Bob Brown', email: 'bob@example.com', phone: '+11234567892' }
    ];
    for (const p of patients) {
      await client.query(
        `INSERT INTO patients (name, email, phone, doctor_id)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT DO NOTHING`,
        [p.name, p.email, p.phone, doctorId]
      );
    }

    // Seed appointments for existing patients
    const pats = await client.query('SELECT id FROM patients ORDER BY id LIMIT 3');
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10);
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const tomorrowStr = tomorrow.toISOString().slice(0, 10);
    const appts = [
      { patientId: pats.rows[0]?.id, date: dateStr, time: '10:00', status: 'scheduled' },
      { patientId: pats.rows[1]?.id, date: dateStr, time: '11:00', status: 'scheduled' },
      { patientId: pats.rows[2]?.id, date: tomorrowStr, time: '14:00', status: 'scheduled' }
    ].filter(a => a.patientId);
    for (const a of appts) {
      await client.query(
        `INSERT INTO appointments (patient_id, doctor_id, date, time, status)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT DO NOTHING`,
        [a.patientId, doctorId, a.date, a.time, a.status]
      );
    }

    console.log('Database initialized and seeded.');
  } finally {
    await client.end();
  }
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});


