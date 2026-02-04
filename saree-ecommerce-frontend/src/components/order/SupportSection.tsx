import React from 'react';

const SupportSection: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-md shadow-sm text-sm">
      <h4 className="font-semibold mb-2">Need help with this order?</h4>
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
        <button onClick={() => window.alert('Call support')} className="px-4 py-2 bg-gray-800 text-white rounded mb-2 sm:mb-0">Call Support</button>
        <button onClick={() => window.alert('WhatsApp')} className="px-4 py-2 border rounded mb-2 sm:mb-0">WhatsApp</button>
        <button onClick={() => window.alert('Email')} className="px-4 py-2 border rounded">Email</button>
      </div>
    </div>
  );
};

export default SupportSection;
