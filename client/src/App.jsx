import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Patients from './pages/Patients.jsx';
import Appointments from './pages/Appointments.jsx';
import PatientProfile from './pages/PatientProfile.jsx';
import { getUser, logout } from './services/auth.js';
import { hasAnyRole } from './components/RoleGuard.jsx';
import { Notification } from './components/Notification.jsx';

function PrivateRoute({ children }) {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RoleRoute({ allowedRoles, children }) {
  const user = getUser();
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  const [user, setUser] = useState(getUser());
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const onStorage = () => setUser(getUser());
    window.addEventListener('storage', onStorage);
    // Expose notification function globally for pages to use
    window.showNotification = (message, type = 'success') => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 3000);
    };
    return () => {
      window.removeEventListener('storage', onStorage);
      delete window.showNotification;
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl p-2 sm:p-4">
      <header className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <nav className="flex flex-wrap items-center gap-2 sm:gap-4">
          <Link className="font-medium" to="/">Dashboard</Link>
          {(hasAnyRole('admin', 'doctor', 'receptionist')) && (
            <Link className="font-medium" to="/patients">Patients</Link>
          )}
          {(hasAnyRole('admin', 'doctor', 'receptionist')) && (
            <Link className="font-medium" to="/appointments">Appointments</Link>
          )}
          {(hasAnyRole('admin')) && (
            <Link className="font-medium" to="/users">Users</Link>
          )}
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-gray-700">{user.name} ({user.role})</span>
              <button onClick={() => { logout(); setUser(null); navigate('/login'); }}>Logout</button>
            </>
          ) : (
            <Link to="/login" className="text-sm">Login</Link>
          )}
        </div>
      </header>
      <div className="h-px w-full bg-gray-200" />
      <main className="mt-4">
        <Routes>
          <Route path="/login" element={<Login onLoggedIn={() => setUser(getUser())} />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/patients" element={<PrivateRoute><Patients /></PrivateRoute>} />
          <Route path="/patients/:id" element={<PrivateRoute><PatientProfile /></PrivateRoute>} />
          <Route path="/appointments" element={<PrivateRoute><Appointments /></PrivateRoute>} />
        </Routes>
      </main>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}


