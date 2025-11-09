# API Documentation

Base URL: `http://localhost:4000/api`

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication

### POST `/auth/login`
Login and receive JWT token.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

**Status Codes:**
- 200: Success
- 400: Missing email or password
- 401: Invalid credentials

---

### POST `/auth/logout`
Logout (client-side token removal).

**Response:**
```json
{
  "ok": true
}
```

---

## Users

### GET `/users`
Get all users (Admin only).

**Response:**
```json
[
  {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
]
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 403: Forbidden (not admin)

---

### POST `/users`
Create new user (Admin only).

**Request Body:**
```json
{
  "name": "New User",
  "email": "user@example.com",
  "password": "password123",
  "role": "doctor"
}
```

**Response:**
```json
{
  "id": 4,
  "name": "New User",
  "email": "user@example.com",
  "role": "doctor"
}
```

**Status Codes:**
- 201: Created
- 400: Missing required fields
- 401: Unauthorized
- 403: Forbidden (not admin)
- 409: Email already exists

---

## Patients

### GET `/patients`
Get all patients.

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+11234567890",
    "doctor_id": 2
  }
]
```

**Status Codes:**
- 200: Success
- 401: Unauthorized

---

### POST `/patients`
Create new patient.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+11234567891",
  "doctor_id": 2
}
```

**Response:**
```json
{
  "id": 4,
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+11234567891",
  "doctor_id": 2
}
```

**Status Codes:**
- 201: Created
- 400: Missing required fields
- 401: Unauthorized

---

### GET `/patients/:id`
Get patient by ID with appointments.

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+11234567890",
  "doctor_id": 2,
  "appointments": [
    {
      "id": 1,
      "patient_id": 1,
      "doctor_id": 2,
      "date": "2024-01-15",
      "time": "10:00:00",
      "status": "scheduled"
    }
  ]
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 404: Patient not found

---

### PUT `/patients/:id`
Update patient.

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "phone": "+11234567890",
  "doctor_id": 2
}
```

**Response:**
```json
{
  "id": 1,
  "name": "John Updated",
  "email": "john.updated@example.com",
  "phone": "+11234567890",
  "doctor_id": 2
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 404: Patient not found

---

### DELETE `/patients/:id`
Delete patient (Admin only).

**Response:**
```json
{
  "ok": true
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized

---

## Appointments

### GET `/appointments`
Get all appointments.

**Response:**
```json
[
  {
    "id": 1,
    "patient_id": 1,
    "doctor_id": 2,
    "date": "2024-01-15",
    "time": "10:00:00",
    "status": "scheduled",
    "patient_name": "John Doe"
  }
]
```

**Status Codes:**
- 200: Success
- 401: Unauthorized

---

### POST `/appointments`
Create new appointment.

**Request Body:**
```json
{
  "patient_id": 1,
  "doctor_id": 2,
  "date": "2024-01-20",
  "time": "14:00",
  "status": "scheduled"
}
```

**Response:**
```json
{
  "id": 4,
  "patient_id": 1,
  "doctor_id": 2,
  "date": "2024-01-20",
  "time": "14:00:00",
  "status": "scheduled"
}
```

**Status Codes:**
- 201: Created
- 400: Missing required fields
- 401: Unauthorized

---

## Dashboard

### GET `/dashboard`
Get dashboard statistics and today's appointments.

**Response:**
```json
{
  "stats": {
    "totalPatients": 10,
    "totalAppointments": 25,
    "totalUsers": 3
  },
  "todayAppointments": [
    {
      "id": 1,
      "patient_id": 1,
      "doctor_id": 2,
      "date": "2024-01-15",
      "time": "10:00:00",
      "status": "scheduled",
      "patient_name": "John Doe"
    }
  ]
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 500: Server error

---

## Medical Records

### GET `/medical-records/patient/:patientId`
Get all medical records for a patient.

**Response:**
```json
[
  {
    "id": 1,
    "patient_id": 1,
    "doctor_id": 2,
    "notes": "Patient shows improvement. Continue medication.",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z",
    "doctor_name": "Dr. Strange"
  }
]
```

**Status Codes:**
- 200: Success
- 401: Unauthorized

---

### POST `/medical-records`
Create new medical record.

**Request Body:**
```json
{
  "patient_id": 1,
  "doctor_id": 2,
  "notes": "Initial consultation. Patient reports symptoms."
}
```

**Response:**
```json
{
  "id": 2,
  "patient_id": 1,
  "doctor_id": 2,
  "notes": "Initial consultation. Patient reports symptoms.",
  "created_at": "2024-01-15T11:00:00.000Z",
  "updated_at": "2024-01-15T11:00:00.000Z"
}
```

**Status Codes:**
- 201: Created
- 400: Missing required fields
- 401: Unauthorized

---

### PUT `/medical-records/:id`
Update medical record.

**Request Body:**
```json
{
  "notes": "Updated notes here"
}
```

**Response:**
```json
{
  "id": 1,
  "patient_id": 1,
  "doctor_id": 2,
  "notes": "Updated notes here",
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T12:00:00.000Z"
}
```

**Status Codes:**
- 200: Success
- 400: Missing notes
- 401: Unauthorized
- 404: Record not found

---

### DELETE `/medical-records/:id`
Delete medical record.

**Response:**
```json
{
  "ok": true
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": "Error message here"
}
```

**Common Status Codes:**
- 400: Bad Request (validation errors, missing fields)
- 401: Unauthorized (missing or invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found (resource doesn't exist)
- 409: Conflict (duplicate entry, e.g., email already exists)
- 500: Internal Server Error

