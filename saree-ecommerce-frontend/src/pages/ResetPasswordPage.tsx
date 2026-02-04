import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import { authAPI } from '../services/api';
import { Lock, Mail, ArrowLeft, CheckCircle, Eye, EyeOff } from 'lucide-react';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, _setEmail] = useState(searchParams.get('email') || '');
  const [token] = useState(searchParams.get('token') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      addNotification('Passwords do not match', 'error');
      return;
    }
    
    if (password.length < 8) {
      addNotification('Password must be at least 8 characters', 'error');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await authAPI.resetPassword({
        token,
        email,
        password,
        password_confirmation: confirmPassword
      });
      addNotification('Password reset successfully', 'success');
      setIsReset(true);
    } catch (error: any) {
      addNotification('Failed to reset password. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfaf8] py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/login" className="inline-flex items-center text-maroon-600 hover:text-maroon-700 font-bold mb-6 gap-2 transition-transform hover:-translate-x-1">
            <ArrowLeft size={20} /> Back to Login
          </Link>
          <h2 className="text-3xl font-serif font-bold text-gray-900">New Password</h2>
          <p className="mt-2 text-gray-600">Secure your account with a new password</p>
        </div>
        
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-maroon-100/50 border border-maroon-50 transition-all">
          {isReset ? (
            <div className="text-center space-y-4 py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-2">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Success!</h3>
              <p className="text-gray-600 leading-relaxed">
                Your password has been updated. You can now log in with your new credentials.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-4 bg-maroon-900 text-white font-bold rounded-2xl hover:bg-maroon-950 transition-all mt-4"
              >
                Go to Login
              </button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                    <Mail size={18} className="text-gray-400 group-focus-within:text-maroon-600" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    readOnly
                    value={email}
                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-100 border border-gray-200 text-gray-500 rounded-2xl outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 ml-1">
                  New Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-maroon-600 transition-colors">
                    <Lock size={18} className="text-gray-400 group-focus-within:text-maroon-600" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl focus:ring-2 focus:ring-maroon-500 focus:border-transparent transition-all outline-none"
                    placeholder="Min 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-maroon-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 ml-1">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-maroon-600 transition-colors">
                    <Lock size={18} className="text-gray-400 group-focus-within:text-maroon-600" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl focus:ring-2 focus:ring-maroon-500 focus:border-transparent transition-all outline-none"
                    placeholder="Repeat new password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-4 bg-maroon-900 hover:bg-maroon-950 text-white font-bold rounded-2xl shadow-lg shadow-maroon-200 transition-all disabled:opacity-70 mt-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;