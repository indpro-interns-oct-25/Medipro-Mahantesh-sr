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
    return <div className="text-center text-gray-600">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold">Dashboard</h2>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="rounded-lg bg-blue-50 p-6 shadow">
          <div className="text-sm font-medium text-blue-600">Total Patients</div>
          <div className="mt-2 text-3xl font-bold text-blue-900">{stats.totalPatients}</div>
        </div>
        <div className="rounded-lg bg-green-50 p-6 shadow">
          <div className="text-sm font-medium text-green-600">Total Appointments</div>
          <div className="mt-2 text-3xl font-bold text-green-900">{stats.totalAppointments}</div>
        </div>
        <div className="rounded-lg bg-purple-50 p-6 shadow">
          <div className="text-sm font-medium text-purple-600">Total Users</div>
          <div className="mt-2 text-3xl font-bold text-purple-900">{stats.totalUsers}</div>
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-xl font-semibold">Today's Appointments</h3>
        {todayAppointments.length === 0 ? (
          <p className="text-gray-500">No appointments scheduled for today.</p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Time</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Patient</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {todayAppointments.map(a => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm font-medium">{a.time}</td>
                    <td className="px-4 py-2 text-sm">
                      <Link to={`/patients/${a.patient_id}`} className="text-blue-600 hover:underline">
                        {a.patient_name}
                      </Link>
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <span className={`rounded-full px-2 py-1 text-xs ${
                        a.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        a.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
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

