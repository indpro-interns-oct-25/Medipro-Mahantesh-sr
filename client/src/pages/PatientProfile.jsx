import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api.js';
import { getUser } from '../services/auth.js';

export default function PatientProfile() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const user = getUser();

  const load = async () => {
    setLoading(true);
    try {
      const [patientData, recordsData] = await Promise.all([
        api(`/patients/${id}`),
        api(`/medical-records/patient/${id}`)
      ]);
      setPatient(patientData);
      setForm({ name: patientData.name || '', email: patientData.email || '', phone: patientData.phone || '' });
      setMedicalRecords(recordsData);
    } catch (error) {
      console.error('Failed to load patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const save = async (e) => {
    e.preventDefault();
    try {
      await api(`/patients/${id}`, { method: 'PUT', body: { ...form, doctor_id: patient?.doctor_id } });
      if (window.showNotification) {
        window.showNotification('Patient information updated successfully!', 'success');
      }
      await load();
    } catch (error) {
      if (window.showNotification) {
        window.showNotification(error.message || 'Failed to update patient', 'error');
      }
    }
  };

  const addMedicalRecord = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    try {
      await api('/medical-records', {
        method: 'POST',
        body: {
          patient_id: Number(id),
          doctor_id: user?.id,
          notes: newNote
        }
      });
      setNewNote('');
      if (window.showNotification) {
        window.showNotification('Medical record added successfully!', 'success');
      }
      await load();
    } catch (error) {
      if (window.showNotification) {
        window.showNotification(error.message || 'Failed to add medical record', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-night-700 border-t-primary-500"></div>
          <p className="text-slate-400">Loading patient profile...</p>
        </div>
      </div>
    );
  }
  
  if (!patient) {
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center">
        <svg className="mx-auto h-12 w-12 text-red-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-red-700 font-medium">Patient not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-md">
          <span className="text-2xl font-bold text-white">{patient.name.charAt(0).toUpperCase()}</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">{patient.name}</h1>
          <p className="text-slate-400">Patient Profile</p>
        </div>
      </div>
      
      {/* Patient Info & Appointments */}
      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={save} className="card-elevated p-6 animate-slide-up">
          <h3 className="mb-4 text-lg font-semibold text-white">Edit Patient Information</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Name *</label>
              <input 
                className="input"
                placeholder="Full name" 
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })} 
                required 
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
              <input 
                type="email" 
                className="input"
                placeholder="email@example.com" 
                value={form.email} 
                onChange={(e) => setForm({ ...form, email: e.target.value })} 
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Phone</label>
              <input 
                className="input"
                placeholder="Phone number" 
                value={form.phone} 
                onChange={(e) => setForm({ ...form, phone: e.target.value })} 
              />
            </div>
            <button type="submit" className="btn btn-primary w-full">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            </button>
          </div>
        </form>
        
        <div className="card-elevated p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="mb-4 text-lg font-semibold text-white">Appointments</h3>
          <div className="space-y-3">
            {(patient.appointments || []).length === 0 ? (
              <div className="py-8 text-center">
                <svg className="mx-auto h-12 w-12 text-night-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-slate-400">No appointments</p>
              </div>
            ) : (
              (patient.appointments || []).map(a => (
                <div key={a.id} className="rounded-lg border border-night-700 bg-night-700/60 p-4 transition-colors hover:bg-night-600/60">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">{a.date?.slice(0,10)}</div>
                      <div className="text-sm text-slate-400">{a.time}</div>
                    </div>
                    <span className={`badge ${
                      a.status === 'completed' ? 'badge-success' : 
                      a.status === 'scheduled' ? 'badge-info' : 
                      'badge-gray'
                    }`}>
                      {a.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Medical Records Section */}
      <div className="card-elevated p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <h3 className="mb-6 text-xl font-bold text-white">Medical Records</h3>
        
        {/* Add New Medical Record */}
        <form onSubmit={addMedicalRecord} className="mb-6">
          <label className="mb-2 block text-sm font-medium text-slate-300">Add Medical Note</label>
          <textarea
            className="input min-h-[100px] resize-y"
            placeholder="Enter medical notes, observations, or treatment details..."
            rows="4"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary mt-3">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Medical Record
          </button>
        </form>

        {/* Medical Records List */}
        <div>
          {medicalRecords.length === 0 ? (
            <div className="py-12 text-center">
              <svg className="mx-auto h-16 w-16 text-night-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-slate-400 font-medium">No medical records yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {medicalRecords.map(record => (
                <div key={record.id} className="rounded-lg border border-night-700 bg-night-800 p-5 transition-all hover:shadow-[0_20px_35px_-25px_rgba(59,130,246,0.5)]">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500/20">
                        <svg className="h-5 w-5 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-white">{record.doctor_name || 'Unknown Doctor'}</div>
                        <div className="text-xs text-slate-400">{new Date(record.created_at).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">{record.notes}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


