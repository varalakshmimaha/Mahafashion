import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Lock, Phone, Eye, EyeOff, LogIn, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(phone, password);
      addNotification('Welcome back to Maha Fashion!', 'success');
      navigate('/');
    } catch (error) {
      addNotification('Invalid credentials. Please check your phone/password.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfaf8] py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo/Brand Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-6">
            <h1 className="text-4xl font-serif font-bold text-maroon-950 tracking-tight">
              Maha Fashion<span className="text-maroon-600">.</span>
            </h1>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-gray-600">Enter your details to access your account</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-maroon-100/50 border border-maroon-50 transition-all">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              {/* Phone Input */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-maroon-600">
                    <Phone size={18} className="text-gray-400 group-focus-within:text-maroon-600" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl focus:ring-2 focus:ring-maroon-500 focus:border-transparent transition-all outline-none placeholder:text-gray-400"
                    placeholder="Enter your registered number"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-sm font-bold text-maroon-600 hover:text-maroon-700 transition-colors">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-maroon-600">
                    <Lock size={18} className="text-gray-400 group-focus-within:text-maroon-600" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl focus:ring-2 focus:ring-maroon-500 focus:border-transparent transition-all outline-none placeholder:text-gray-400"
                    placeholder="Enter your security password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-maroon-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-4 px-4 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-bold rounded-2xl shadow-lg transition-all disabled:opacity-70 active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={20} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-600">
              New to Maha Fashion?{' '}
              <Link to="/register" className="font-bold text-maroon-600 hover:text-maroon-700 inline-flex items-center gap-1 group">
                Create Account <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </p>
          </div>
        </div>
        
        {/* Footer info */}
        <p className="mt-10 text-center text-xs text-gray-400 uppercase tracking-widest">
          100% Secure Authentication | Handcrafted in India
        </p>
      </div>
    </div>
  );
};

export default LoginPage;