import { useEffect, useState } from 'react';
import React from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Patients from './pages/Patients.jsx';
import Appointments from './pages/Appointments.jsx';
import PatientProfile from './pages/PatientProfile.jsx';
import Users from './pages/Users.jsx';
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
  const [menuOpen, setMenuOpen] = useState(false);
  
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
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Modern Navbar */}
        <header className="sticky top-0 z-40 mb-6 mt-4">
          <nav className="card-elevated flex items-center justify-between px-6 py-4 animate-slide-down border border-night-700/80 bg-night-900/70">
            <div className="flex items-center gap-6">
              <Link 
                className="flex items-center gap-2.5 font-bold text-xl text-white hover:text-primary-300 transition-colors duration-200" 
                to="/" 
                onClick={() => setMenuOpen(false)}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 shadow-md">
                  <img src="/logo.svg" alt="Medicare Pro" className="h-6 w-6" />
                </div>
                <span className="hidden sm:inline bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                  Medicare Pro
                </span>
              </Link>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-1">
                <Link 
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-200 hover:text-white hover:bg-night-700 transition-all duration-200" 
                  to="/"
                >
                  Dashboard
                </Link>
                {(hasAnyRole('admin', 'doctor', 'receptionist')) && (
                  <Link 
                    className="px-4 py-2 rounded-lg text-sm font-medium text-slate-200 hover:text-white hover:bg-night-700 transition-all duration-200" 
                    to="/patients"
                  >
                    Patients
                  </Link>
                )}
                {(hasAnyRole('admin', 'doctor', 'receptionist')) && (
                  <Link 
                    className="px-4 py-2 rounded-lg text-sm font-medium text-slate-200 hover:text-white hover:bg-night-700 transition-all duration-200" 
                    to="/appointments"
                  >
                    Appointments
                  </Link>
                )}
                {(hasAnyRole('admin')) && (
                  <Link 
                    className="px-4 py-2 rounded-lg text-sm font-medium text-slate-200 hover:text-white hover:bg-night-700 transition-all duration-200" 
                    to="/users"
                  >
                    Users
                  </Link>
                )}
              </div>
            </div>

            {/* User Menu & Mobile Toggle */}
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-lg bg-night-800/70 border border-night-700">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-xs font-semibold text-white shadow-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">{user.name}</span>
                      <span className="text-xs text-slate-400 capitalize">{user.role}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => { logout(); setUser(null); navigate('/login'); }}
                    className="btn btn-ghost text-sm"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              ) : (
                <Link to="/login" className="btn btn-primary text-sm">
                  Login
                </Link>
              )}
              
              {/* Mobile Menu Button */}
              <button
                className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-slate-200 hover:bg-night-700 transition-colors"
                aria-label="Toggle menu"
                onClick={() => setMenuOpen(v => !v)}
              >
                {menuOpen ? (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </nav>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="absolute left-4 right-4 z-30 mt-2 card-elevated animate-slide-down md:hidden">
              <div className="flex flex-col py-2">
                <Link 
                  className="px-4 py-3 text-sm font-medium text-slate-200 hover:bg-night-700 hover:text-white transition-colors" 
                  to="/" 
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                {(hasAnyRole('admin', 'doctor', 'receptionist')) && (
                  <Link 
                    className="px-4 py-3 text-sm font-medium text-slate-200 hover:bg-night-700 hover:text-white transition-colors" 
                    to="/patients" 
                    onClick={() => setMenuOpen(false)}
                  >
                    Patients
                  </Link>
                )}
                {(hasAnyRole('admin', 'doctor', 'receptionist')) && (
                  <Link 
                    className="px-4 py-3 text-sm font-medium text-slate-200 hover:bg-night-700 hover:text-white transition-colors" 
                    to="/appointments" 
                    onClick={() => setMenuOpen(false)}
                  >
                    Appointments
                  </Link>
                )}
                {(hasAnyRole('admin')) && (
                  <Link 
                    className="px-4 py-3 text-sm font-medium text-slate-200 hover:bg-night-700 hover:text-white transition-colors" 
                    to="/users" 
                    onClick={() => setMenuOpen(false)}
                  >
                    Users
                  </Link>
                )}
              </div>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="pb-12">
          <Routes>
            <Route path="/login" element={<Login onLoggedIn={() => setUser(getUser())} />} />
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/patients" element={<PrivateRoute><Patients /></PrivateRoute>} />
            <Route path="/patients/:id" element={<PrivateRoute><PatientProfile /></PrivateRoute>} />
            <Route path="/appointments" element={<PrivateRoute><Appointments /></PrivateRoute>} />
            <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
          </Routes>
        </main>

        {/* Notification */}
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    </div>
  );
}


