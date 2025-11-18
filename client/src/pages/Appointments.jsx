import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { hasAnyRole } from '../components/RoleGuard.jsx';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({ patient_id: '', date: '', time: '' });

  const load = async () => {
    const [appts, pats] = await Promise.all([
      api('/appointments'),
      api('/patients')
    ]);
    setAppointments(appts);
    setPatients(pats);
  };

  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    try {
      await api('/appointments', { method: 'POST', body: form });
      setForm({ patient_id: '', date: '', time: '' });
      if (window.showNotification) {
        window.showNotification('Appointment created successfully!', 'success');
      }
      await load();
    } catch (error) {
      if (window.showNotification) {
        window.showNotification(error.message || 'Failed to create appointment', 'error');
      }
    }
  };

  const [updatingId, setUpdatingId] = useState(null);
  const statusOptions = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      await api(`/appointments/${id}`, { method: 'PATCH', body: { status } });
      if (window.showNotification) {
        window.showNotification('Appointment status updated', 'success');
      }
      await load();
    } catch (error) {
      if (window.showNotification) {
        window.showNotification(error.message || 'Failed to update status', 'error');
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const pad2 = (n) => (n < 10 ? `0${n}` : `${n}`);
  const deriveTemporalStatus = (appointment) => {
    if (!appointment?.date) return 'scheduled';

    const datePart = appointment.date.slice(0, 10); // "YYYY-MM-DD"
    const timePart = (appointment.time || '00:00').slice(0, 5); // "HH:mm"

    const now = new Date();
    const todayStr = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
    const nowHHMM = `${pad2(now.getHours())}:${pad2(now.getMinutes())}`;

    if (datePart > todayStr) return 'scheduled';
    if (datePart < todayStr) return 'completed';

    // Same day: compare times lexicographically
    return timePart > nowHHMM ? 'scheduled' : 'completed';
  };

  const getStatus = (appointment) => {
    const normalized = (appointment?.status || '').toLowerCase();
    const knownStatuses = new Set(['scheduled', 'completed', 'cancelled', 'pending', 'in_progress']);

    if (knownStatuses.has(normalized)) {
      return normalized;
    }

    return deriveTemporalStatus(appointment);
  };

  const statusLabels = {
    scheduled: 'Scheduled',
    pending: 'Pending',
    completed: 'Completed',
    cancelled: 'Cancelled',
    in_progress: 'In Progress',
  };

  const statusClasses = {
    scheduled: 'badge-info',
    pending: 'badge-warning',
    completed: 'badge-success',
    cancelled: 'bg-danger-500/15 text-danger-200 border border-danger-500/30',
    in_progress: 'bg-accent-500/15 text-accent-200 border border-accent-500/30',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Appointments</h1>
          <p className="text-slate-300">Schedule and track appointments</p>
        </div>
      </div>

      {/* Create Appointment Form */}
      {(hasAnyRole('admin', 'receptionist')) && (
        <form onSubmit={add} className="card-elevated p-6 animate-slide-up">
          <h3 className="mb-4 text-lg font-semibold text-white">Schedule New Appointment</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Patient *</label>
              <select 
                className="input" 
                value={form.patient_id} 
                onChange={(e) => setForm({ ...form, patient_id: Number(e.target.value) })} 
                required
              >
                <option value="">Select patient</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Date *</label>
              <input 
                type="date" 
                className="input"
                value={form.date} 
                onChange={(e) => setForm({ ...form, date: e.target.value })} 
                required 
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Time *</label>
              <input 
                type="time" 
                className="input"
                value={form.time} 
                onChange={(e) => setForm({ ...form, time: e.target.value })} 
                required 
              />
            </div>
            <div className="flex items-end">
              <button type="submit" className="btn btn-primary w-full">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Appointments Table */}
      <div className="card-elevated overflow-hidden animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="overflow-x-auto">
          <table className="table-modern">
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                {(hasAnyRole('admin', 'receptionist', 'doctor')) && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <svg className="mx-auto h-16 w-16 text-night-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-slate-400 font-medium">No appointments found</p>
                  </td>
                </tr>
              ) : (
                appointments.map(a => {
                  const statusKey = getStatus(a);
                  const badgeClass = statusClasses[statusKey] || 'badge-gray';
                  const label = statusLabels[statusKey] || (statusKey ? statusKey : 'Unknown');

                  return (
                    <tr key={a.id}>
                      <td className="font-mono text-xs text-slate-400">{a.id}</td>
                      <td className="font-medium text-white">{a.patient_name}</td>
                      <td className="text-slate-300">{a.date?.slice(0,10)}</td>
                      <td className="text-slate-300">{a.time}</td>
                      <td>
                        <span className={`badge ${badgeClass}`}>
                          {label}
                        </span>
                      </td>
                      {(hasAnyRole('admin', 'receptionist', 'doctor')) && (
                        <td>
                          <select
                            className="input"
                            value={statusKey}
                            disabled={updatingId === a.id}
                            onChange={(e) => updateStatus(a.id, e.target.value)}
                          >
                            {statusOptions.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


