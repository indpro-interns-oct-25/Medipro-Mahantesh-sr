-- Database: medicare_pro (create manually if needed)

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin','doctor','receptionist'))
);

CREATE TABLE IF NOT EXISTS patients (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  doctor_id INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled'
);

CREATE TABLE IF NOT EXISTS medical_records (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  notes TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample users (password is bcrypt of "password123")
-- You should replace these hashes in production
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin User','admin@example.com','$2a$10$w4dFY2r0r8QH3m6b9X4C2eZ9pP3a0u0i6gQ7m7Lz0mYvVh4aT1z7m','admin')
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (name, email, password_hash, role) VALUES
('Dr. Strange','doctor@example.com','$2a$10$w4dFY2r0r8QH3m6b9X4C2eZ9pP3a0u0i6gQ7m7Lz0mYvVh4aT1z7m','doctor')
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (name, email, password_hash, role) VALUES
('Front Desk','reception@example.com','$2a$10$w4dFY2r0r8QH3m6b9X4C2eZ9pP3a0u0i6gQ7m7Lz0mYvVh4aT1z7m','receptionist')
ON CONFLICT (email) DO NOTHING;

-- Sample patients
INSERT INTO patients (name, email, phone, doctor_id) VALUES
('John Doe','john@example.com','+11234567890', 2),
('Jane Smith','jane@example.com','+11234567891', 2),
('Bob Brown','bob@example.com','+11234567892', 2)
ON CONFLICT DO NOTHING;

-- Sample appointments
INSERT INTO appointments (patient_id, doctor_id, date, time, status) VALUES
(1, 2, CURRENT_DATE, '10:00', 'scheduled'),
(2, 2, CURRENT_DATE, '11:00', 'scheduled'),
(3, 2, CURRENT_DATE + INTERVAL '1 day', '14:00', 'scheduled')
ON CONFLICT DO NOTHING;


