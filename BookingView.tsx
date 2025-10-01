import React from 'react';
import BookingForm from '../components/BookingForm';
import { RESTAURANT_NAME, RESTAURANT_ADDRESS } from '../constants';

const BookingView: React.FC = () => {
  return (
    <div>
      <section 
        className="relative bg-cover bg-center rounded-lg shadow-xl overflow-hidden mb-8 md:mb-12 h-80 md:h-96"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-white text-center p-4">
          <h1 className="text-4xl md:text-6xl font-bold font-display leading-tight mb-2 text-shadow-custom">Welcome to {RESTAURANT_NAME}</h1>
          <p className="text-lg md:text-xl mb-4 max-w-2xl text-shadow-custom">Experience authentic cuisine in a warm and inviting atmosphere. Book your table now for an unforgettable dining experience.</p>
          <p className="text-sm text-shadow-custom">{RESTAURANT_ADDRESS}</p>
        </div>
      </section>

      <section id="book-table" className="scroll-mt-20">
        <BookingForm />
      </section>
    </div>
  );
};

export default BookingView;
