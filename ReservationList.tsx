import React, { useState } from 'react';
import { Reservation, ReservationStatus } from '../types';
import { useReservations } from '../hooks/useReservations';
import ActionConfirmationModal from './ActionConfirmationModal';

interface ReservationListProps {
  reservations: Reservation[];
}

type Action = 'confirm' | 'cancel' | 'complete' | 'delete';

interface ActionState {
  action: Action | null;
  reservation: Reservation | null;
}

const statusColors: Record<ReservationStatus, string> = {
  [ReservationStatus.Pending]: 'bg-yellow-100 text-yellow-800',
  [ReservationStatus.Confirmed]: 'bg-green-100 text-green-800',
  [ReservationStatus.Cancelled]: 'bg-red-100 text-red-800',
  [ReservationStatus.Completed]: 'bg-blue-100 text-blue-800',
};

const ReservationList: React.FC<ReservationListProps> = ({ reservations }) => {
  const { updateReservationStatus, deleteReservation } = useReservations();
  const [recentlyUpdatedId, setRecentlyUpdatedId] = useState<string | null>(null);
  const [actionState, setActionState] = useState<ActionState>({ action: null, reservation: null });

  const handleActionClick = (action: Action, reservation: Reservation) => {
    setActionState({ action, reservation });
  };
  
  const handleConfirmAction = async () => {
    if (!actionState.action || !actionState.reservation) return;

    const { action, reservation } = actionState;
    
    try {
      switch (action) {
        case 'confirm':
          await updateReservationStatus(reservation.id, ReservationStatus.Confirmed);
          break;
        case 'cancel':
          await updateReservationStatus(reservation.id, ReservationStatus.Cancelled);
          break;
        case 'complete':
          await updateReservationStatus(reservation.id, ReservationStatus.Completed);
          break;
        case 'delete':
          await deleteReservation(reservation.id);
          break;
      }
      setRecentlyUpdatedId(reservation.id);
      setTimeout(() => setRecentlyUpdatedId(null), 1500);
    } catch (error) {
      console.error(`Failed to ${action} reservation:`, error);
      alert(`Could not perform action. Please try again.`);
    } finally {
      handleCloseModal();
    }
  };
  
  const handleCloseModal = () => {
    setActionState({ action: null, reservation: null });
  };

  if (reservations.length === 0) {
    return <p className="text-center text-gray-500 mt-8">No reservations found for the selected filters.</p>;
  }

  const sortedReservations = [...reservations].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`).getTime();
    const dateB = new Date(`${b.date}T${b.time}`).getTime();
    return dateA - dateB;
  });
  
  const getModalStrings = () => {
    // Fix: Ensure the function always returns an object with the required properties (title, message, actionLabel)
    // to satisfy the ActionConfirmationModal's prop types, even when the modal is not visible.
    if (!actionState.action || !actionState.reservation) return { title: '', message: '', actionLabel: '' };
    const { action, reservation } = actionState;
    switch (action) {
        case 'confirm': return { title: 'Confirm Reservation', message: `Are you sure you want to confirm the booking for ${reservation.name}?`, actionLabel: 'Confirm' };
        case 'cancel': return { title: 'Cancel Reservation', message: `Are you sure you want to cancel the booking for ${reservation.name}?`, actionLabel: 'Cancel Booking' };
        case 'complete': return { title: 'Complete Reservation', message: `Are you sure you want to mark the booking for ${reservation.name} as completed?`, actionLabel: 'Complete' };
        case 'delete': return { title: 'Delete Reservation', message: `This action is irreversible. Are you sure you want to permanently delete the booking for ${reservation.name}?`, actionLabel: 'Delete Permanently' };
        default: return { title: '', message: '', actionLabel: '' };
    }
  }

  return (
    <>
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-slate-200/80">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Details</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {sortedReservations.map((res) => (
                <tr key={res.id} className={recentlyUpdatedId === res.id ? 'animate-highlight' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">{res.name}</div>
                    <div className="text-sm text-slate-500">{res.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{res.date} at {res.time}</div>
                    <div className="text-sm text-slate-500">{res.guests} Guest{res.guests > 1 ? 's' : ''}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[res.status]}`}>
                      {res.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                        {res.status === ReservationStatus.Pending && (
                            <button onClick={() => handleActionClick('confirm', res)} className="text-green-600 hover:text-green-900">Confirm</button>
                        )}
                        {res.status === ReservationStatus.Confirmed && (
                            <button onClick={() => handleActionClick('complete', res)} className="text-blue-600 hover:text-blue-900">Complete</button>
                        )}
                        {(res.status === ReservationStatus.Pending || res.status === ReservationStatus.Confirmed) && (
                            <button onClick={() => handleActionClick('cancel', res)} className="text-yellow-600 hover:text-yellow-900">Cancel</button>
                        )}
                        <button onClick={() => handleActionClick('delete', res)} className="text-red-600 hover:text-red-900">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ActionConfirmationModal 
        isOpen={!!actionState.action}
        onClose={handleCloseModal}
        onConfirm={handleConfirmAction}
        isDestructive={actionState.action === 'delete' || actionState.action === 'cancel'}
        {...getModalStrings()}
      />
    </>
  );
};

export default ReservationList;
