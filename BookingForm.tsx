import React, { useState } from 'react';
import { useReservations } from '../hooks/useReservations';
import { TIME_SLOTS } from '../constants';
import { generateConfirmationMessage } from '../services/geminiService';
import ConfirmationModal from './ConfirmationModal';
import { Reservation } from '../types';

const BookingForm: React.FC = () => {
  const { addReservation, getAvailableTablesForSlot } = useReservations();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);
  const [aiMessage, setAiMessage] = useState('');

  const getTablesNeeded = (numGuests: number) => Math.ceil(numGuests / 4);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!name || !phone || !date || !time) {
      setError('Please fill in all fields.');
      setIsLoading(false);
      return;
    }

    const tablesAvailable = getAvailableTablesForSlot(date, time);
    const tablesNeeded = getTablesNeeded(guests);
    
    if (tablesAvailable < tablesNeeded) {
      setError(`Sorry, not enough tables available for ${guests} guests at ${time}. Only ${tablesAvailable * 4} seats are available.`);
      setIsLoading(false);
      return;
    }

    try {
      const newReservation = { name, phone, guests: Number(guests), date, time };
      const addedReservation = await addReservation(newReservation);
      
      setConfirmedReservation(addedReservation);
      setShowConfirmation(true);
      
      // Generate AI message in the background
      generateConfirmationMessage(addedReservation).then(setAiMessage);

      // Reset form
      setName('');
      setPhone('');
      setGuests(2);
      setDate(new Date().toISOString().split('T')[0]);
      setTime('');

    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isTimeSlotAvailable = (slotTime: string): boolean => {
    if (!date) return false;
    const tablesAvailable = getAvailableTablesForSlot(date, slotTime);
    const tablesNeeded = getTablesNeeded(guests);
    return tablesAvailable >= tablesNeeded;
  };

  return (
    <>
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-slate-200/80 max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center font-display text-slate-900 mb-6">Book Your Table</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-600">Full Name</label>
              <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-600">Phone Number</label>
              <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} required className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="guests" className="block text-sm font-medium text-slate-600">Number of Guests</label>
              <select id="guests" value={guests} onChange={e => setGuests(Number(e.target.value))} required className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm">
                {[...Array(10)].map((_, i) => <option key={i+1} value={i+1}>{i+1} Guest{i > 0 ? 's' : ''}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-slate-600">Date</label>
              <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} required className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">Time Slot</label>
            <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {TIME_SLOTS.map(slot => {
                const isAvailable = isTimeSlotAvailable(slot);
                return (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => isAvailable && setTime(slot)}
                    disabled={!isAvailable}
                    className={`p-2 rounded-md text-sm font-semibold transform transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500
                      ${time === slot ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700'}
                      ${isAvailable ? 'hover:bg-amber-500 hover:text-white hover:scale-105 cursor-pointer' : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-70'}
                    `}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
          
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={isLoading || !time}
            className="w-full bg-amber-600 text-white font-bold py-3 px-4 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-300 transform hover:-translate-y-0.5"
          >
            {isLoading ? 'Checking Availability...' : 'Book Now'}
          </button>
        </form>
      </div>

      {showConfirmation && confirmedReservation && (
        <ConfirmationModal
          reservation={confirmedReservation}
          aiMessage={aiMessage}
          onClose={() => {
            setShowConfirmation(false);
            setAiMessage('');
            setConfirmedReservation(null);
          }}
        />
      )}
    </>
  );
};

export default BookingForm;
