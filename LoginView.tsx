import React, { useState } from 'react';
import { UserRole } from '../types';
import * as api from '../services/apiService';

interface LoginViewProps {
  onLoginSuccess: (role: UserRole) => void;
  onNavigateToSignUp: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onNavigateToSignUp }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await api.authenticateUser(username, password);
      if (result) {
        onLoginSuccess(result.role);
      } else {
        setError('Invalid username or password.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center pt-10">
      <div className="bg-white p-8 rounded-lg shadow-md border border-slate-200/80 max-w-sm w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-center font-display text-slate-900 mb-6">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-600">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              placeholder="admin or nikhil@gmail.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-600">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              placeholder="password or Admin"
            />
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-600 text-white font-bold py-3 px-4 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-300"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-sm text-slate-600 mt-4">
          Don't have an account?{' '}
          <button onClick={onNavigateToSignUp} className="font-medium text-amber-600 hover:text-amber-500">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginView;
