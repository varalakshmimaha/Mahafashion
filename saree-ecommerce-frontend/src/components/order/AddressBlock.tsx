import React from 'react';

interface Address {
  name: string;
  phone: string;
  address: string;
  pincode: string;
}

const AddressBlock: React.FC<{ address?: Address }> = ({ address }) => {
  if (!address) return null;

  return (
    <div className="bg-white p-4 rounded-md shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Delivery Address</h3>
      <div className="text-sm text-gray-700">
        <div className="font-medium">{address.name}</div>
        <div className="text-sm">{address.phone}</div>
        <div className="mt-2">{address.address}</div>
        <div className="mt-1">Pincode: {address.pincode}</div>
      </div>
    </div>
  );
};

export default AddressBlock;
