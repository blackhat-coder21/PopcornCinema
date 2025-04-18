import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, LogIn } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useUserStore } from '../../store/user-store';
import { mockUsers } from '../../data/mock-data';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useUserStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    setError('');
    
    // Simple validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    // For demo purposes, just use the first mock user
    // In a real app, you would validate credentials
    login(mockUsers[0]);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-dark-200 p-4">
      <div className="bg-white dark:bg-dark-100 p-8 rounded-xl shadow-xl max-w-md w-full">
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center justify-center gap-2 mb-2">
            <Film
              size={32}
              className="text-primary-600 dark:text-primary-400"
            />
            <span className="font-bold text-2xl text-gray-900 dark:text-white">
            Popcorn Cinema
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Log in to your account
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Please enter your details.
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="input w-full"
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <a href="#" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input w-full"
            />
          </div>
          
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Remember me
            </label>
          </div>
          
          <Button
            type="submit"
            fullWidth
            leftIcon={<LogIn size={18} />}
          >
            Sign In
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};