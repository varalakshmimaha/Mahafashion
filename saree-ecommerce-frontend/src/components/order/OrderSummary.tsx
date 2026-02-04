import React from 'react';
import { Copy, CheckCircle } from 'lucide-react';

interface Props {
  orderId: string;
  placedAt?: string;
  status?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  total?: number | string;
  currency?: string;
}

const friendlyPayment = (pm?: string) => {
  if (!pm) return '';
  const p = pm.toLowerCase();
  if (p === 'cod') return 'Cash on Delivery';
  if (p === 'razorpay') return 'Razorpay';
  if (p === 'upi') return 'UPI';
  if (p === 'card') return 'Card';
  return pm;
};

const getStatusColor = (status?: string) => {
  const s = (status || '').toLowerCase();
  if (s === 'delivered') return 'bg-green-100 text-green-800';
  if (s === 'shipped' || s === 'out_for_delivery') return 'bg-blue-100 text-blue-800';
  if (s === 'confirmed' || s === 'placed') return 'bg-purple-100 text-purple-800';
  if (s === 'cancelled') return 'bg-red-100 text-red-800';
  return 'bg-yellow-100 text-yellow-800';
};

const OrderSummary: React.FC<Props> = ({ orderId, placedAt, status, paymentMethod, paymentStatus, total, currency = '₹' }) => {
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(String(orderId));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // ignore
    }
  };

  const isCOD = (paymentMethod || '').toLowerCase() === 'cod';
  const totalAmount = typeof total === 'number' ? total : parseFloat(String(total || 0));

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Order Number</div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900">#{orderId}</h2>
              <button
                onClick={copy}
                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                title="Copy order number"
              >
                {copied ? (
                  <CheckCircle size={18} className="text-green-600" />
                ) : (
                  <Copy size={18} className="text-gray-400" />
                )}
              </button>
            </div>
            {placedAt && (
              <div className="text-sm text-gray-600 mt-2">
                Placed on {new Date(placedAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
            )}
          </div>

          <div className="md:text-right">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Status</div>
            <div className="mb-3">
              <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                {(status || 'Pending').toUpperCase()}
              </span>
            </div>

            {/* ✅ COD Payment Display Rules */}
            <div className="space-y-1">
              <div className="text-xs text-gray-500">Payment Method</div>
              <div className="font-medium text-gray-900">{friendlyPayment(paymentMethod)}</div>

              {isCOD ? (
                <div className="mt-2">
                  <div className="text-xs text-gray-500">Payable Amount on Delivery</div>
                  <div className="text-2xl font-bold text-maroon-600">{currency}{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                </div>
              ) : (
                <div className="mt-2">
                  <div className="text-xs text-gray-500">Total Amount</div>
                  <div className="text-2xl font-bold text-gray-900">{currency}{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                  {paymentStatus && (
                    <div className={`text-xs mt-1 ${paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>
                      {paymentStatus === 'paid' ? '✓ Paid' : 'Payment Pending'}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
