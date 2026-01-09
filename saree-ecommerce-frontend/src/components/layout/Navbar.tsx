import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiHeart, FiShoppingCart, FiMenu, FiX } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import ProfileDropdown from './ProfileDropdown';
import { settingsAPI } from '../../services/api';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);
  const [websiteName, setWebsiteName] = useState<string>('Maha Fashion'); // Default to 'Maha Fashion'
  const navigate = useNavigate();
  
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await settingsAPI.getSettings();
        setLogo(settings.logo);
        if (settings.website_name) {
          setWebsiteName(settings.website_name);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          {/* Logo */}
          <div className="flex-shrink-0">
            {logo ? (
              <Link to="/" className="flex items-center">
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="h-10 object-contain"
                  onError={(e) => {
                    // Fallback to text if logo fails to load
                    setLogo(null);
                  }}
                />
              </Link>
            ) : (
              <Link to="/" className="text-2xl font-serif font-bold text-primary hover:text-primary-dark transition-colors">
                {websiteName}
              </Link>
            )}
          </div>

          {/* Main Navigation Menu - Desktop */}
          <nav className="hidden md:flex md:space-x-8">
            <Link to="/" className="text-gray-600 hover:text-primary font-medium transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-gray-600 hover:text-primary font-medium transition-colors">
              Products
            </Link>
            <Link to="/collections" className="text-gray-600 hover:text-primary font-medium transition-colors">
              Collections
            </Link>
            <Link to="/track-order" className="text-gray-600 hover:text-primary font-medium transition-colors">
              Track Orders
            </Link>
          </nav>

          {/* Search and Icons */}
          <div className="flex items-center space-x-4">
            {/* Search - Desktop */}
            <div className="hidden md:block">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for sarees, kurtis, shirts..."
                  className="pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 w-48 lg:w-64"
                />
                <button type="submit" className="absolute top-0 left-0 inline-flex items-center p-2">
                  <FiSearch className="text-gray-400" />
                </button>
              </form>
            </div>
            
            {/* User Account */}
            <ProfileDropdown />
            
            {/* Wishlist with Count */}
            <Link to="/wishlist" className="relative text-gray-600 hover:text-accent transition-colors">
              <FiHeart size={24} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>
            
            {/* Cart with Count */}
            <Link to="/cart" className="relative text-gray-600 hover:text-primary transition-colors">
              <FiShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative mb-4">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for sarees, kurtis, shirts..."
                className="w-full pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
              <button type="submit" className="absolute top-0 left-0 inline-flex items-center p-2">
                <FiSearch className="text-gray-400" />
              </button>
            </form>

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="text-gray-600 hover:text-gray-800 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className="text-gray-600 hover:text-gray-800 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                to="/collections" 
                className="text-gray-600 hover:text-gray-800 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Collections
              </Link>
              <Link 
                to="/track-order" 
                className="text-gray-600 hover:text-gray-800 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Track Orders
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
