import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { hasAnyRole } from '../components/RoleGuard.jsx';
import { validateEmail, validatePhone, getValidationError } from '../utils/validation.js';

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const data = await api('/patients');
      setPatients(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const addPatient = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setErrors({});
    
    // Validate
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (form.email && !validateEmail(form.email)) newErrors.email = 'Invalid email format';
    if (form.phone && !validatePhone(form.phone)) newErrors.phone = 'Invalid phone format';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      await api('/patients', { method: 'POST', body: form });
      setForm({ name: '', email: '', phone: '' });
      setErrors({});
      if (window.showNotification) {
        window.showNotification('Patient added successfully!', 'success');
      }
      await load();
    } catch (error) {
      setSubmitError(error.message || 'Failed to add patient');
      if (window.showNotification) {
        window.showNotification(error.message || 'Failed to add patient', 'error');
      }
    }
  };

  const deletePatient = async (id) => {
    if (!confirm('Are you sure you want to delete this patient?')) return;
    try {
      await api(`/patients/${id}`, { method: 'DELETE' });
      if (window.showNotification) {
        window.showNotification('Patient deleted successfully', 'success');
      }
      await load();
    } catch (error) {
      if (window.showNotification) {
        window.showNotification(error.message || 'Failed to delete patient', 'error');
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Patients</h1>
          <p className="text-slate-300">Manage and view patient profiles</p>
        </div>
      </div>

      {/* Add Patient Form */}
      {(hasAnyRole('admin', 'receptionist')) && (
        <form onSubmit={addPatient} className="card-elevated p-6 animate-slide-up">
          <h3 className="mb-4 text-lg font-semibold text-white">Add New Patient</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Name *</label>
              <input 
                className={`input ${errors.name ? 'input-error' : ''}`}
                placeholder="Full name" 
                value={form.name} 
                onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: '' }); }} 
                required 
              />
              {errors.name && <div className="mt-1.5 text-xs text-danger-300">{errors.name}</div>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
              <input 
                className={`input ${errors.email ? 'input-error' : ''}`}
                type="email" 
                placeholder="email@example.com" 
                value={form.email} 
                onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }); }} 
              />
              {errors.email && <div className="mt-1.5 text-xs text-danger-300">{errors.email}</div>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Phone</label>
              <input 
                className={`input ${errors.phone ? 'input-error' : ''}`}
                placeholder="Phone number" 
                value={form.phone} 
                onChange={(e) => { setForm({ ...form, phone: e.target.value }); setErrors({ ...errors, phone: '' }); }} 
              />
              {errors.phone && <div className="mt-1.5 text-xs text-danger-300">{errors.phone}</div>}
            </div>
          </div>
          {submitError && (
            <div className="mb-4 rounded-lg bg-danger-500/10 border border-danger-500/30 p-3 text-sm text-danger-200">
              {submitError}
            </div>
          )}
          <button type="submit" className="btn btn-primary">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Patient
          </button>
        </form>
      )}

      {/* Patients Table */}
      {loading ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-night-700 border-t-primary-500"></div>
            <p className="text-slate-400">Loading patients...</p>
          </div>
        </div>
      ) : (
        <div className="card-elevated overflow-hidden animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="overflow-x-auto">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                  {hasAnyRole('admin') && <th>Delete</th>}
                </tr>
              </thead>
              <tbody>
                {patients.length === 0 ? (
                  <tr>
                    <td colSpan={hasAnyRole('admin') ? 6 : 5} className="px-6 py-12 text-center">
                      <svg className="mx-auto h-16 w-16 text-night-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <p className="text-slate-400 font-medium">No patients found</p>
                    </td>
                  </tr>
                ) : (
                  patients.map(p => (
                    <tr key={p.id}>
                      <td className="font-mono text-xs text-slate-400">{p.id}</td>
                      <td className="font-medium text-white">{p.name}</td>
                      <td className="text-slate-300">{p.email || <span className="text-slate-500">—</span>}</td>
                      <td className="text-slate-300">{p.phone || <span className="text-slate-500">—</span>}</td>
                      <td>
                        <Link to={`/patients/${p.id}`} className="link text-sm">
                          View Profile
                        </Link>
                      </td>
                      {hasAnyRole('admin') && (
                        <td>
                          <button 
                            onClick={() => deletePatient(p.id)} 
                            className="btn btn-ghost text-danger-300 hover:text-danger-200 hover:bg-danger-500/10 text-sm p-2"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}


