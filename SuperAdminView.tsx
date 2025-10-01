import React, { useState, useEffect } from 'react';
import { AdminUser } from '../types';
import * as api from '../services/apiService';

const SuperAdminView: React.FC = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        const adminUsers = await api.getAllAdmins();
        setAdmins(adminUsers);
      } catch (err) {
        setError('Failed to load admin users.');
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-display text-slate-900">Super Admin Dashboard</h1>
        <p className="text-slate-600 mt-2">Manage all admin users.</p>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-slate-200/80">
        <div className="overflow-x-auto">
          {loading && <p className="p-4 text-center">Loading admin users...</p>}
          {error && <p className="p-4 text-center text-red-600">{error}</p>}
          {!loading && !error && (
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Username</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {admins.map((admin) => (
                  <tr key={admin.username}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{admin.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        admin.role === 'superadmin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {admin.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminView;
