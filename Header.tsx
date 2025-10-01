import React from 'react';
import { RESTAURANT_NAME } from '../constants';
import { View } from '../App';
import { UserRole } from '../types';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
  userRole: UserRole | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView, userRole, onLogout }) => {
  
  const getAdminButtonClass = () => {
    const adminViews: View[] = ['admin', 'login', 'signup', 'superadmin'];
    return adminViews.includes(currentView) ? 'bg-amber-600 text-white shadow' : 'text-slate-600 hover:bg-slate-200';
  }

  const handleAdminClick = () => {
    if (userRole === 'superadmin') {
      setView('superadmin');
    } else if (userRole === 'admin') {
      setView('admin');
    } else {
      setView('login');
    }
  }

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-slate-200">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="flex items-center space-x-2">
          <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          <h1 className="text-2xl font-bold font-display text-slate-900">{RESTAURANT_NAME}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-slate-100 rounded-full p-1">
            <button
              onClick={() => setView('user')}
              className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-300 ${
                currentView === 'user' ? 'bg-amber-600 text-white shadow' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Booking
            </button>
            <button
              onClick={handleAdminClick}
              className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-300 ${getAdminButtonClass()}`}
            >
              {userRole === 'superadmin' ? 'Super Admin' : 'Admin'}
            </button>
          </div>
          {userRole && (
            <button
              onClick={onLogout}
              className="px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-300 text-red-600 hover:bg-red-100"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
