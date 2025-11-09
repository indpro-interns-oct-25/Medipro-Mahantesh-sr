# Database Schema Documentation

Database: `medicare_pro` (PostgreSQL)

---

## Tables

### `users`
Stores system users (admin, doctors, receptionists).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Auto-incrementing user ID |
| name | TEXT | NOT NULL | User's full name |
| email | TEXT | NOT NULL, UNIQUE | User's email address |
| password_hash | TEXT | NOT NULL | Bcrypt hashed password |
| role | TEXT | NOT NULL, CHECK | User role: 'admin', 'doctor', or 'receptionist' |

**Indexes:**
- Primary key on `id`
- Unique constraint on `email`

**Sample Data:**
- Admin: admin@example.com / password123
- Doctor: doctor@example.com / password123
- Receptionist: reception@example.com / password123

---

### `patients`
Stores patient information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Auto-incrementing patient ID |
| name | TEXT | NOT NULL | Patient's full name |
| email | TEXT | NULL | Patient's email address |
| phone | TEXT | NULL | Patient's phone number |
| doctor_id | INTEGER | FOREIGN KEY → users(id) | Assigned doctor (nullable) |

**Foreign Keys:**
- `doctor_id` REFERENCES `users(id)` ON DELETE SET NULL

**Indexes:**
- Primary key on `id`

---

### `appointments`
Stores appointment scheduling information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Auto-incrementing appointment ID |
| patient_id | INTEGER | NOT NULL, FOREIGN KEY → patients(id) | Patient for appointment |
| doctor_id | INTEGER | FOREIGN KEY → users(id) | Assigned doctor (nullable) |
| date | DATE | NOT NULL | Appointment date |
| time | TIME | NOT NULL | Appointment time |
| status | TEXT | NOT NULL, DEFAULT 'scheduled' | Appointment status |

**Foreign Keys:**
- `patient_id` REFERENCES `patients(id)` ON DELETE CASCADE
- `doctor_id` REFERENCES `users(id)` ON DELETE SET NULL

**Indexes:**
- Primary key on `id`

**Status Values:**
- 'scheduled' (default)
- 'completed'
- 'cancelled'

---

### `medical_records`
Stores medical notes and records for patients.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Auto-incrementing record ID |
| patient_id | INTEGER | NOT NULL, FOREIGN KEY → patients(id) | Patient for this record |
| doctor_id | INTEGER | FOREIGN KEY → users(id) | Doctor who created/updated record |
| notes | TEXT | NOT NULL | Medical notes content |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record last update timestamp |

**Foreign Keys:**
- `patient_id` REFERENCES `patients(id)` ON DELETE CASCADE
- `doctor_id` REFERENCES `users(id)` ON DELETE SET NULL

**Indexes:**
- Primary key on `id`

---

## Entity Relationship Diagram (ERD)

```
users (1) ──< (many) patients (doctor_id)
users (1) ──< (many) appointments (doctor_id)
users (1) ──< (many) medical_records (doctor_id)

patients (1) ──< (many) appointments (patient_id)
patients (1) ──< (many) medical_records (patient_id)
```

**Relationships:**
- One user (doctor) can have many patients
- One user (doctor) can have many appointments
- One user (doctor) can create many medical records
- One patient can have many appointments
- One patient can have many medical records

---

## Database Initialization

Run the initialization script to create all tables and seed sample data:

```bash
cd server
npm run db:init
```

This script:
1. Creates all tables if they don't exist
2. Seeds 3 test users (admin, doctor, receptionist)
3. Seeds 3 sample patients
4. Seeds 3 sample appointments

**Note:** The script uses bcrypt to hash passwords properly. All test accounts use password: `password123`

---

## Common Queries

### Get all patients with their assigned doctor
```sql
SELECT p.*, u.name AS doctor_name
FROM patients p
LEFT JOIN users u ON p.doctor_id = u.id;
```

### Get today's appointments
```sql
SELECT a.*, p.name AS patient_name
FROM appointments a
JOIN patients p ON a.patient_id = p.id
WHERE a.date = CURRENT_DATE
ORDER BY a.time;
```

### Get patient with all appointments and medical records
```sql
SELECT 
  p.*,
  json_agg(DISTINCT jsonb_build_object(
    'id', a.id, 'date', a.date, 'time', a.time, 'status', a.status
  )) AS appointments,
  json_agg(DISTINCT jsonb_build_object(
    'id', mr.id, 'notes', mr.notes, 'created_at', mr.created_at
  )) AS medical_records
FROM patients p
LEFT JOIN appointments a ON a.patient_id = p.id
LEFT JOIN medical_records mr ON mr.patient_id = p.id
WHERE p.id = $1
GROUP BY p.id;
```

---

## Data Types

- **SERIAL**: Auto-incrementing integer (PostgreSQL)
- **TEXT**: Variable-length string
- **INTEGER**: 32-bit integer
- **DATE**: Date without time
- **TIME**: Time without date
- **TIMESTAMP**: Date and time

---

## Constraints

- **NOT NULL**: Field must have a value
- **UNIQUE**: Field values must be unique across rows
- **PRIMARY KEY**: Unique identifier for the row
- **FOREIGN KEY**: References another table's primary key
- **CHECK**: Validates value against a condition (e.g., role must be one of specific values)
- **DEFAULT**: Provides a default value if not specified
- **ON DELETE CASCADE**: When referenced row is deleted, delete this row
- **ON DELETE SET NULL**: When referenced row is deleted, set this field to NULL

