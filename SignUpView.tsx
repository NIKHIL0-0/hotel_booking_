import React, { useState } from 'react';
import * as api from '../services/apiService';

interface SignUpViewProps {
    onSignUpSuccess: () => void;
    onNavigateToLogin: () => void;
}

const SignUpView: React.FC<SignUpViewProps> = ({ onSignUpSuccess, onNavigateToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if(password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }

    setIsLoading(true);

    try {
      await api.registerAdmin(username, password);
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        onSignUpSuccess();
      }, 2000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred during sign-up.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center pt-10">
      <div className="bg-white p-8 rounded-lg shadow-md border border-slate-200/80 max-w-sm w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-center font-display text-slate-900 mb-6">Create Admin Account</h2>
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
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-600">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
            />
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          {success && <p className="text-green-600 text-sm text-center">{success}</p>}

          <button
            type="submit"
            disabled={isLoading || !!success}
            className="w-full bg-amber-600 text-white font-bold py-3 px-4 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-300"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
         <p className="text-center text-sm text-slate-600 mt-4">
          Already have an account?{' '}
          <button onClick={onNavigateToLogin} className="font-medium text-amber-600 hover:text-amber-500">
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUpView;
