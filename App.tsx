import React, { useState } from 'react';
import { ReservationsProvider } from './context/ReservationsContext';
import Header from './components/Header';
import BookingView from './views/BookingView';
import AdminView from './views/AdminView';
import LoginView from './views/LoginView';
import SuperAdminView from './views/SuperAdminView';
import SignUpView from './views/SignUpView';
import { UserRole } from './types';

export type View = 'user' | 'admin' | 'login' | 'superadmin' | 'signup';

const App: React.FC = () => {
  const [view, setView] = useState<View>('user');
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const handleSetView = (targetView: View) => {
    setView(targetView);
  };

  const handleLoginSuccess = (role: UserRole) => {
    setUserRole(role);
    setView(role === 'superadmin' ? 'superadmin' : 'admin');
  };

  const handleLogout = () => {
    setUserRole(null);
    setView('user');
  };

  const renderView = () => {
    switch(view) {
      case 'user':
        return <BookingView />;
      case 'admin':
        return userRole ? <AdminView /> : <LoginView onLoginSuccess={handleLoginSuccess} onNavigateToSignUp={() => setView('signup')} />;
      case 'superadmin':
        return userRole === 'superadmin' ? <SuperAdminView /> : <LoginView onLoginSuccess={handleLoginSuccess} onNavigateToSignUp={() => setView('signup')} />;
      case 'login':
        return <LoginView onLoginSuccess={handleLoginSuccess} onNavigateToSignUp={() => setView('signup')} />;
      case 'signup':
        return <SignUpView onSignUpSuccess={() => setView('login')} onNavigateToLogin={() => setView('login')} />;
      default:
        return <BookingView />;
    }
  }

  return (
    <ReservationsProvider>
      <div className="min-h-screen bg-slate-50 text-slate-800">
        <Header 
          currentView={view} 
          setView={handleSetView}
          userRole={userRole}
          onLogout={handleLogout}
        />
        <main className="container mx-auto p-4 md:p-8">
          {renderView()}
        </main>
        <footer className="text-center p-4 text-slate-500 text-sm">
          <p>&copy; 2024 MyHome Restaurant. All rights reserved.</p>
        </footer>
      </div>
    </ReservationsProvider>
  );
};

export default App;
