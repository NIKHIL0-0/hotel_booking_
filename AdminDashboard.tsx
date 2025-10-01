import React, { useState, useMemo, useEffect } from 'react';
import { useReservations } from '../hooks/useReservations';
import ReservationList from './ReservationList';
import { ReservationStatus, Reservation } from '../types';

const getNextBookingDate = (reservations: Reservation[]): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of today

  const upcomingReservations = reservations
    .filter(r => 
      (r.status === ReservationStatus.Pending || r.status === ReservationStatus.Confirmed) &&
      new Date(r.date) >= today
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (upcomingReservations.length > 0) {
    return upcomingReservations[0].date;
  }
  
  return new Date().toISOString().split('T')[0];
};

const AdminDashboard: React.FC = () => {
  const { reservations, loading, error, refetchReservations } = useReservations();
  const [filterDate, setFilterDate] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<ReservationStatus | 'all'>('all');
  
  useEffect(() => {
    if (reservations.length > 0 && !filterDate) {
      setFilterDate(getNextBookingDate(reservations));
    }
  }, [reservations, filterDate]);

  const filteredReservations = useMemo(() => {
    return reservations.filter(res => {
      const dateMatch = !filterDate || res.date === filterDate;
      const statusMatch = filterStatus === 'all' || res.status === filterStatus;
      return dateMatch && statusMatch;
    });
  }, [reservations, filterDate, filterStatus]);
  
  const statusCounts = useMemo(() => {
    const source = filterDate ? reservations.filter(r => r.date === filterDate) : reservations;
    const counts: Record<string, number> = { all: source.length };
    Object.values(ReservationStatus).forEach(status => {
        counts[status] = source.filter(r => r.status === status).length;
    });
    return counts;
  }, [reservations, filterDate]);


  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <label htmlFor="date-filter" className="font-semibold text-slate-700">Filter by Date:</label>
          <input
            type="date"
            id="date-filter"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border-slate-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
          />
           <button onClick={() => setFilterDate('')} className="text-sm text-amber-600 hover:underline">Show All Dates</button>
           <button onClick={refetchReservations} disabled={loading} className="text-sm text-amber-600 hover:underline flex items-center gap-1 disabled:opacity-50">
             <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 15M20 20l-1.5-1.5A9 9 0 003.5 9"></path></svg>
             Refresh
            </button>
        </div>
        <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Status:</span>
            <div className="flex items-center bg-slate-100 rounded-full p-1">
            {(['all', ...Object.values(ReservationStatus)] as const).map(status => (
                <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors duration-200 ${
                        filterStatus === status ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
                    }`}
                >
                    {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status] || 0})
                </button>
            ))}
            </div>
        </div>
      </div>
      
      {loading && <p className="text-center text-slate-600">Loading reservations...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}
      {!loading && !error && <ReservationList reservations={filteredReservations} />}
    </div>
  );
};

export default AdminDashboard;
