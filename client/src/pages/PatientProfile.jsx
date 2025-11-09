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

  if (loading) return <div className="text-gray-600">Loading...</div>;
  if (!patient) return <div className="text-red-600">Patient not found</div>;

  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold">Patient Profile: {patient.name}</h2>
      
      {/* Patient Info & Appointments */}
      <div className="mb-6 grid gap-6 md:grid-cols-2">
        <form onSubmit={save} className="grid gap-3 rounded-lg bg-white p-4 shadow">
          <h3 className="text-lg font-semibold">Edit Patient Info</h3>
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <button type="submit">Save Changes</button>
        </form>
        <div className="rounded-lg bg-white p-4 shadow">
          <h3 className="mb-2 text-lg font-semibold">Appointments</h3>
          <ul className="space-y-2">
            {(patient.appointments || []).length === 0 ? (
              <li className="text-gray-500">No appointments</li>
            ) : (
              (patient.appointments || []).map(a => (
                <li key={a.id} className="rounded border border-gray-200 p-3 text-sm">
                  <span className="font-medium">{a.date?.slice(0,10)} {a.time}</span>
                  <span className="ml-2 text-gray-600">— {a.status}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/* Medical Records Section */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-xl font-semibold">Medical Records</h3>
        
        {/* Add New Medical Record */}
        <form onSubmit={addMedicalRecord} className="mb-6">
          <textarea
            className="mb-2 w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add medical notes..."
            rows="3"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            required
          />
          <button type="submit">Add Medical Record</button>
        </form>

        {/* Medical Records List */}
        <div>
          {medicalRecords.length === 0 ? (
            <p className="text-gray-500">No medical records yet.</p>
          ) : (
            <div className="space-y-3">
              {medicalRecords.map(record => (
                <div key={record.id} className="rounded border border-gray-200 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        {record.doctor_name || 'Unknown Doctor'}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">
                        {new Date(record.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">{record.notes}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


