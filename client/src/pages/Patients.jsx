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
    <div>
      <h2 className="mb-3 text-2xl font-semibold">Patients</h2>
      {(hasAnyRole('admin', 'receptionist')) && (
        <form onSubmit={addPatient} className="mb-4">
          <div className="mb-2 flex flex-wrap items-start gap-2">
            <div className="w-48">
              <input 
                className={`w-full ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Name *" 
                value={form.name} 
                onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: '' }); }} 
                required 
              />
              {errors.name && <div className="mt-1 text-xs text-red-600">{errors.name}</div>}
            </div>
            <div className="w-60">
              <input 
                className={`w-full ${errors.email ? 'border-red-500' : ''}`}
                type="email" 
                placeholder="Email" 
                value={form.email} 
                onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }); }} 
              />
              {errors.email && <div className="mt-1 text-xs text-red-600">{errors.email}</div>}
            </div>
            <div className="w-48">
              <input 
                className={`w-full ${errors.phone ? 'border-red-500' : ''}`}
                placeholder="Phone" 
                value={form.phone} 
                onChange={(e) => { setForm({ ...form, phone: e.target.value }); setErrors({ ...errors, phone: '' }); }} 
              />
              {errors.phone && <div className="mt-1 text-xs text-red-600">{errors.phone}</div>}
            </div>
            <button type="submit" className="self-end">Add Patient</button>
          </div>
          {submitError && <div className="text-sm text-red-600">{submitError}</div>}
        </form>
      )}
      {loading ? (
        <div className="text-gray-600">Loading...</div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Phone</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Actions</th>
                {hasAnyRole('admin') && (
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Delete</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {patients.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-700">{p.id}</td>
                  <td className="px-4 py-2 text-sm font-medium">{p.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{p.email || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{p.phone || '-'}</td>
                  <td className="px-4 py-2 text-sm"><Link to={`/patients/${p.id}`} className="text-blue-600 hover:underline">View Profile</Link></td>
                  {hasAnyRole('admin') && (
                    <td className="px-4 py-2 text-sm">
                      <button onClick={() => deletePatient(p.id)} className="text-red-600 hover:underline text-xs">Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


