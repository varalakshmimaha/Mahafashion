import React from 'react';
import { Receipt } from 'lucide-react';

interface Pricing {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
}

interface Props {
  pricing: Pricing;
  total: number;
}

const PriceBreakdown: React.FC<Props> = ({ pricing, total }) => {
  const formatAmount = (amount: number) => {
    return amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b flex items-center gap-2">
        <Receipt size={20} className="text-gray-600" />
        <h3 className="font-semibold text-gray-900">Price Breakdown</h3>
      </div>

      <div className="p-4">
        <div className="space-y-3 text-sm">
          {/* Subtotal */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium text-gray-900">₹{formatAmount(pricing.subtotal)}</span>
          </div>

          {/* Discount - only show if > 0 */}
          {pricing.discount > 0 && (
            <div className="flex justify-between items-center text-green-600">
              <span>Discount</span>
              <span className="font-medium">-₹{formatAmount(pricing.discount)}</span>
            </div>
          )}

          {/* Shipping */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Shipping</span>
            {pricing.shipping === 0 ? (
              <span className="font-medium text-green-600">FREE</span>
            ) : (
              <span className="font-medium text-gray-900">₹{formatAmount(pricing.shipping)}</span>
            )}
          </div>

          {/* Tax - only show if > 0 */}
          {pricing.tax > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium text-gray-900">₹{formatAmount(pricing.tax)}</span>
            </div>
          )}

          {/* Total */}
          <div className="border-t pt-3 mt-3 flex justify-between items-center">
            <span className="text-base font-semibold text-gray-900">Total</span>
            <span className="text-xl font-bold text-maroon-600">₹{formatAmount(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceBreakdown;
