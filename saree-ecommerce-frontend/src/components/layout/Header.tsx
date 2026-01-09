import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-maroon-500 text-cream p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-cream">Saree Elegance</Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/products" className="hover:text-gold transition-colors duration-300">Products</Link>
            </li>
            <li>
              <Link to="/wishlist" className="hover:text-gold transition-colors duration-300">Wishlist</Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-gold transition-colors duration-300">Cart</Link>
            </li>
            <li>
              <Link to="/checkout" className="hover:text-gold transition-colors duration-300">Checkout</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
