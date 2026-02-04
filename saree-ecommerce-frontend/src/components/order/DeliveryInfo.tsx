import React from 'react';

interface Shipping {
  courier?: string;
  tracking_id?: string;
  expected_delivery?: string;
}

const DeliveryInfo: React.FC<{ shipping?: Shipping }> = ({ shipping }) => {
  if (!shipping) return null;

  return (
    <div className="bg-white p-4 rounded-md shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Delivery Information</h3>
      {shipping.expected_delivery && <div className="text-sm">Estimated Delivery: {shipping.expected_delivery}</div>}
      {shipping.courier && (
        <div className="mt-2 text-sm">
          <div>Courier: {shipping.courier}</div>
          {shipping.tracking_id && (
            <div>Tracking ID: {shipping.tracking_id}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeliveryInfo;
