# Medicare Pro - Healthcare Management System

A full-stack healthcare management system built with Node.js, Express, React, and PostgreSQL.

## Features

- ✅ User Authentication (JWT-based)
- ✅ Role-Based Access Control (Admin, Doctor, Receptionist)
- ✅ Patient Management (CRUD operations)
- ✅ Appointment Scheduling
- ✅ Medical Records Management
- ✅ Dashboard with Statistics
- ✅ Responsive UI with Tailwind CSS
- ✅ Input Validation & Error Handling

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: React + Vite
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Tailwind CSS

## Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Setup
1) Backend env (create `server/.env`):

```
PORT=4000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/medicare_pro
JWT_SECRET=change_me
JWT_EXPIRES_IN=1d
CORS_ORIGIN=http://localhost:5173
```

2) Create database in PostgreSQL:

```sql
CREATE DATABASE medicare_pro;
```

3) Install deps:

```bash
cd server && npm install
cd ../client && npm install
```

4) Initialize schema & seed:

```bash
cd server
npm run db:init
```

5) Run dev servers:

```bash
cd server && npm run dev
cd ../client && npm run dev
```

### Test accounts
- admin@example.com / password123 (admin)
- doctor@example.com / password123 (doctor)
- reception@example.com / password123 (receptionist)

## Project Structure

```
Medicare-Pro/
├── server/                 # Backend (Express API)
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── middleware/     # Auth middleware
│   │   ├── lib/            # Database utilities
│   │   └── utils/          # Helper functions
│   └── scripts/            # Database initialization
├── client/                 # Frontend (React)
│   ├── src/
│   │   ├── pages/          # Page components
│   │   ├── components/     # Reusable components
│   │   ├── services/       # API service layer
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
└── docs/                   # Documentation files
```

## Documentation

- [API Documentation](./API_DOCUMENTATION.md) - Complete API reference
- [Database Schema](./DATABASE_SCHEMA.md) - Database structure and relationships
- [User Guide](./USER_GUIDE.md) - User manual for all roles
- [Testing Guide](./TESTING_GUIDE.md) - Comprehensive testing checklist
- [Project Plan](./PROJECT_PLAN.md) - Development plan and progress
- [Project Structure](./PROJECT_STRUCTURE.md) - Complete file/folder structure with descriptions

## Development

### Running in Development Mode

**Backend:**
```bash
cd server
npm run dev
```

**Frontend:**
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000

### Database Migration

After creating the database, initialize the schema:
```bash
cd server
npm run db:init
```

This creates all tables and seeds sample data.

## Production Deployment

1. Set environment variables in `server/.env`
2. Use a strong `JWT_SECRET` in production
3. Update `CORS_ORIGIN` to your production domain
4. Build frontend: `cd client && npm run build`
5. Serve frontend build files
6. Run backend with process manager (PM2, etc.)

## License

This project is for educational purposes.


