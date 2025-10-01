import React from 'react';
import AdminDashboard from '../components/AdminDashboard';

const AdminView: React.FC = () => {
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-display text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-600 mt-2">Manage all customer reservations.</p>
      </div>
      <AdminDashboard />
    </div>
  );
};

export default AdminView;
