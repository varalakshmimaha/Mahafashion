import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, LogIn, LogOut, Package, MapPin, Key, ChevronDown, UserCircle, MessageSquare, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { isAuthenticated, user, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown when pressing Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-gray-600 hover:text-maroon-700 transition-all p-1.5 rounded-full hover:bg-maroon-50"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <User size={24} />
        <ChevronDown 
          size={14} 
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 origin-top-right rounded-2xl bg-white shadow-2xl shadow-maroon-200/50 ring-1 ring-maroon-50 focus:outline-none z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="py-2">
            {isAuthenticated ? (
              <>
                {/* User Info Header */}
                <div className="px-5 py-4 bg-maroon-50/50 border-b border-maroon-50 group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-maroon-900 text-white rounded-full flex items-center justify-center font-bold text-lg">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-maroon-950 truncate">{user?.name || 'User'}</p>
                        <p className="text-xs text-maroon-600/70 truncate">{user?.email}</p>
                    </div>
                  </div>
                </div>
                
                {/* Menu Items */}
                <div className="p-2 space-y-0.5">
                    <Link 
                    to="/profile" 
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-maroon-900 hover:bg-maroon-50 rounded-xl transition-all"
                    onClick={() => setIsOpen(false)}
                    >
                    <UserCircle size={18} className="text-gray-400" />
                    Profile
                    </Link>
                    
                    <Link 
                    to="/orders" 
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-maroon-900 hover:bg-maroon-50 rounded-xl transition-all"
                    onClick={() => setIsOpen(false)}
                    >
                    <Package size={18} className="text-gray-400" />
                    My Orders
                    </Link>
                    
                    <Link 
                    to="/addresses" 
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-maroon-900 hover:bg-maroon-50 rounded-xl transition-all"
                    onClick={() => setIsOpen(false)}
                    >
                    <MapPin size={18} className="text-gray-400" />
                    Addresses
                    </Link>
                    
                    <Link 
                    to="/queries" 
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-maroon-900 hover:bg-maroon-50 rounded-xl transition-all"
                    onClick={() => setIsOpen(false)}
                    >
                    <MessageSquare size={18} className="text-gray-400" />
                    My Queries
                    </Link>
                </div>
                
                <div className="p-2 border-t border-gray-50 mt-1">
                    <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                    <LogOut size={18} />
                    Logout
                    </button>
                </div>
              </>
            ) : (
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-center gap-3">
                  <Link 
                    to="/login" 
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-md"
                    onClick={() => setIsOpen(false)}
                  >
                    <LogIn size={16} />
                    Login
                  </Link>
                  <span className="text-gray-400">|</span>
                  <Link 
                    to="/register" 
                    className="flex items-center justify-center gap-2 px-5 py-2.5 border-2 border-primary text-primary rounded-xl font-bold hover:bg-primary hover:text-white transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    <UserPlus size={16} />
                    Register
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
