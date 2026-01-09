import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import { authAPI } from '../services/api';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await authAPI.forgotPassword(email);
      addNotification('Reset link sent to your email', 'success');
      setIsSent(true);
    } catch (error: any) {
      addNotification('Failed to send reset link. Please try again.', 'error');
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
          <h2 className="text-3xl font-serif font-bold text-gray-900">Reset Password</h2>
          <p className="mt-2 text-gray-600">Enter your email and we'll send you instructions</p>
        </div>
        
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-maroon-100/50 border border-maroon-50 transition-all">
          {isSent ? (
            <div className="text-center space-y-4 py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-2">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Check Your Email</h3>
              <p className="text-gray-600 leading-relaxed">
                We've sent a password reset link to <span className="font-semibold text-gray-900">{email}</span>. Please check your inbox and spam folder.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-4 bg-maroon-900 text-white font-bold rounded-2xl hover:bg-maroon-950 transition-all mt-4"
              >
                Return to Login
              </button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-maroon-600 transition-colors">
                    <Mail size={18} className="text-gray-400 group-focus-within:text-maroon-600" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl focus:ring-2 focus:ring-maroon-500 focus:border-transparent transition-all outline-none placeholder:text-gray-400"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-4 bg-maroon-900 hover:bg-maroon-950 text-white font-bold rounded-2xl shadow-lg shadow-maroon-200 transition-all disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={18} />
                    Send Reset Link
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;