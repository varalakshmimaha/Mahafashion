import React from 'react';
import { Link } from 'react-router-dom';

const AddressesPage = () => {
  // Mock address data
  const addresses = [
    {
      id: 1,
      name: 'Home Address',
      street: '123 Saree Lane',
      city: 'Mumbai',
      state: 'Maharashtra',
      zip: '400001',
      isDefault: true,
    },
    {
      id: 2,
      name: 'Office Address',
      street: '456 Business Park',
      city: 'Bangalore',
      state: 'Karnataka',
      zip: '560001',
      isDefault: false,
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-serif font-bold mb-8">Manage Addresses</h1>
      
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Saved Addresses</h2>
          <button className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors">
            Add New Address
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div key={address.id} className="bg-white p-6 rounded-lg shadow-md border">
              {address.isDefault && (
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full mb-3">
                  Default
                </span>
              )}
              <h3 className="text-lg font-semibold mb-2">{address.name}</h3>
              <p className="text-gray-600 mb-1">{address.street}</p>
              <p className="text-gray-600 mb-1">{address.city}, {address.state} {address.zip}</p>
              <div className="flex space-x-3 mt-4">
                <button className="text-sm text-gray-600 hover:text-gray-900 underline">
                  Edit
                </button>
                <button className="text-sm text-gray-600 hover:text-gray-900 underline">
                  Delete
                </button>
                {!address.isDefault && (
                  <button className="text-sm text-gray-600 hover:text-gray-900 underline">
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Add New Address</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="+91 9876543210" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input 
                  type="text" 
                  placeholder="Street address" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input 
                  type="text" 
                  placeholder="City" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input 
                  type="text" 
                  placeholder="State" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                <input 
                  type="text" 
                  placeholder="ZIP Code" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              <div className="md:col-span-2 flex items-center">
                <input 
                  type="checkbox" 
                  id="default-address" 
                  className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                />
                <label htmlFor="default-address" className="ml-2 text-sm text-gray-700">
                  Set as default address
                </label>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors">
                Save Address
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressesPage;
