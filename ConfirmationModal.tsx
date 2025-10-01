import React, { useState, useEffect } from 'react';
import { Reservation } from '../types';
import { sendNotifications, NotificationPrefs } from '../services/notificationService';

interface ConfirmationModalProps {
  reservation: Reservation;
  aiMessage: string;
  onClose: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ reservation, aiMessage, onClose }) => {
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPrefs>({ sms: true, email: false, whatsapp: false });
  const [isSending, setIsSending] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // Duration should match the animation duration
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationPrefs(prev => ({ ...prev, [name]: checked as boolean }));
  };

  const handleConfirmAndSend = async () => {
    setIsSending(true);
    await sendNotifications(reservation, notificationPrefs, aiMessage);
    setIsSending(false);
    handleClose();
  };

  return (
    <div 
        className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-out ${isClosing ? 'opacity-0' : 'opacity-100'}`}
        style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)' }}
        onClick={handleClose}
    >
      <div 
        className={`bg-white rounded-lg shadow-2xl max-w-lg w-full transform transition-all duration-300 ease-out ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h3 className="text-2xl leading-6 font-bold font-display text-slate-900">Booking Confirmed!</h3>
            <div className="mt-4 text-left bg-slate-50 p-4 rounded-md border border-slate-200">
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{aiMessage || 'Confirmation message is being generated...'}</p>
            </div>
        </div>
        
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-2 text-center">How would you like to receive reminders?</h4>
            <div className="flex justify-center space-x-6 text-sm text-slate-700">
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" name="sms" checked={notificationPrefs.sms} onChange={handleCheckboxChange} className="h-4 w-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500" />
                    <span>SMS</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" name="email" checked={notificationPrefs.email} onChange={handleCheckboxChange} className="h-4 w-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500" />
                    <span>Email</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" name="whatsapp" checked={notificationPrefs.whatsapp} onChange={handleCheckboxChange} className="h-4 w-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500" />
                    <span>WhatsApp</span>
                </label>
            </div>
        </div>

        <div className="px-6 py-4 bg-slate-100 border-t border-slate-200">
          <button
            onClick={handleConfirmAndSend}
            type="button"
            disabled={isSending}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-amber-600 text-base font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:text-sm disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSending ? 'Sending Notifications...' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
