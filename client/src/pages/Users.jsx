import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { hasAnyRole } from '../components/RoleGuard.jsx';
import { validateEmail } from '../utils/validation.js';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'doctor' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const data = await api('/users');
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const addUser = async (e) => {
    e.preventDefault();
    setSubmitError('');
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (form.email && !validateEmail(form.email)) newErrors.email = 'Invalid email format';
    if (!form.password || form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!form.role) newErrors.role = 'Role is required';
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    try {
      await api('/users', { method: 'POST', body: form });
      setForm({ name: '', email: '', password: '', role: 'doctor' });
      setErrors({});
      if (window.showNotification) window.showNotification('User created successfully', 'success');
      await load();
    } catch (error) {
      setSubmitError(error.message || 'Failed to create user');
      if (window.showNotification) window.showNotification(error.message || 'Failed to create user', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Users</h1>
          <p className="text-slate-300">Administer staff and roles</p>
        </div>
      </div>

      {/* Add User Form */}
      {hasAnyRole('admin') && (
        <form onSubmit={addUser} className="card-elevated p-6 animate-slide-up">
          <h3 className="mb-4 text-lg font-semibold text-white">Create New User</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
              <label className="mb-2 block text-sm font-medium text-slate-300">Email *</label>
              <input
                className={`input ${errors.email ? 'input-error' : ''}`}
                type="email"
                placeholder="email@example.com"
                value={form.email}
                onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }); }}
                required
              />
              {errors.email && <div className="mt-1.5 text-xs text-danger-300">{errors.email}</div>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Password *</label>
              <input
                className={`input ${errors.password ? 'input-error' : ''}`}
                type="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: '' }); }}
                required
              />
              {errors.password && <div className="mt-1.5 text-xs text-danger-300">{errors.password}</div>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Role *</label>
              <select
                className={`input ${errors.role ? 'input-error' : ''}`}
                value={form.role}
                onChange={(e) => { setForm({ ...form, role: e.target.value }); setErrors({ ...errors, role: '' }); }}
                required
              >
                <option value="doctor">Doctor</option>
                <option value="receptionist">Receptionist</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && <div className="mt-1.5 text-xs text-danger-300">{errors.role}</div>}
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
            Add User
          </button>
        </form>
      )}

      {/* Users Table */}
      {loading ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-night-700 border-t-primary-500"></div>
            <p className="text-slate-400">Loading users...</p>
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
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <svg className="mx-auto h-16 w-16 text-night-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <p className="text-slate-400 font-medium">No users found</p>
                    </td>
                  </tr>
                ) : (
                  users.map(u => (
                    <tr key={u.id}>
                      <td className="font-mono text-xs text-slate-400">{u.id}</td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-xs font-semibold text-white">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-white">{u.name}</span>
                        </div>
                      </td>
                      <td className="text-slate-300">{u.email}</td>
                      <td>
                        <span className={`badge ${
                          u.role === 'admin' ? 'badge-info' :
                          u.role === 'doctor' ? 'badge-success' :
                          'badge-gray'
                        } capitalize`}>
                          {u.role}
                        </span>
                      </td>
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


