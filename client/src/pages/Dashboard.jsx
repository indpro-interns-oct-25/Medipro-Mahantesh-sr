import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.js';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalPatients: 0, totalAppointments: 0, totalUsers: 0 });
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await api('/dashboard');
        setStats(data.stats);
        setTodayAppointments(data.todayAppointments);
      } catch (e) {
        setError('Failed to load dashboard data');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-night-700 border-t-primary-500"></div>
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-danger-500/10 border border-danger-500/40 p-6 text-center">
        <svg className="mx-auto h-12 w-12 text-danger-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-danger-100 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
          <p className="text-slate-300">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-success-500/10 border border-success-500/40">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-success-500"></span>
          </span>
          <span className="text-sm font-medium text-success-100">System healthy</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card p-6 bg-gradient-to-br from-night-800 via-night-700 to-primary-900/40 border-primary-900/30 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-md">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="badge badge-info">All time</span>
          </div>
          <div className="text-sm font-medium text-primary-100 mb-1">Total Patients</div>
          <div className="text-4xl font-bold text-white">{stats.totalPatients}</div>
        </div>

        <div className="card p-6 bg-gradient-to-br from-night-800 via-night-700 to-success-500/20 border-success-500/30 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="badge badge-success">All time</span>
          </div>
          <div className="text-sm font-medium text-success-100 mb-1">Total Appointments</div>
          <div className="text-4xl font-bold text-white">{stats.totalAppointments}</div>
        </div>

        <div className="card p-6 bg-gradient-to-br from-night-800 via-night-700 to-accent-600/30 border-accent-500/30 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-md">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="badge badge-gray">Active</span>
          </div>
          <div className="text-sm font-medium text-accent-100 mb-1">Total Users</div>
          <div className="text-4xl font-bold text-white">{stats.totalUsers}</div>
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="card-elevated p-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">Today's Appointments</h3>
            <p className="text-sm text-slate-400 mt-1">Scheduled appointments for today</p>
          </div>
          <Link to="/appointments" className="btn btn-ghost text-sm">
            View all
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        {todayAppointments.length === 0 ? (
          <div className="py-12 text-center">
            <svg className="mx-auto h-16 w-16 text-night-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-slate-400 font-medium">No appointments scheduled for today.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-night-700">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Patient</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {todayAppointments.map(a => (
                  <tr key={a.id}>
                    <td className="font-medium text-white">{a.time}</td>
                    <td>
                      <Link to={`/patients/${a.patient_id}`} className="link">
                        {a.patient_name}
                      </Link>
                    </td>
                    <td>
                      <span className={`badge ${
                        a.status === 'scheduled' ? 'badge-info' :
                        a.status === 'completed' ? 'badge-success' :
                        'badge-gray'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

