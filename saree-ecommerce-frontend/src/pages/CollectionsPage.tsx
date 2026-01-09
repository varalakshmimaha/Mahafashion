import React from 'react';
import { Link } from 'react-router-dom';

const CollectionsPage = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-serif font-bold text-center mb-4">Our Collections</h1>
      <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
        Explore our exquisite collection of traditional and contemporary sarees, 
        handpicked for every occasion.
      </p>
      
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4">Collections have been removed from the system</h2>
        <p className="text-gray-600 mb-6">Please browse our products directly from the homepage or use the search functionality.</p>
        <Link 
          to="/products"
          className="inline-block bg-maroon-600 hover:bg-maroon-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
};

export default CollectionsPage;
