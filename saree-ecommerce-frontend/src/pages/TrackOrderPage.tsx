import React, { useState } from 'react';
import { FiSearch, FiPackage, FiTruck, FiCheckCircle } from 'react-icons/fi';

interface OrderStatus {
  id: string;
  order_number: string;
  status: string;
  items: number;
  total: number;
  created_at: string;
  tracking_number?: string;
}

const TrackOrderPage = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderNumber.trim()) {
      setError('Please enter an order number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulated order tracking - in production, this would call the API
      // const response = await orderAPI.getOrderByNumber(orderNumber);
      
      // For demo purposes, showing a mock response
      setTimeout(() => {
        if (orderNumber.startsWith('ORD-')) {
          setOrderStatus({
            id: '1',
            order_number: orderNumber,
            status: 'shipped',
            items: 2,
            total: 12998,
            created_at: '2025-12-20T10:00:00Z',
            tracking_number: 'TRK123456789'
          });
        } else {
          setError('Order not found. Please check your order number and try again.');
          setOrderStatus(null);
        }
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Unable to track order. Please try again later.');
      setLoading(false);
    }
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'pending': return 1;
      case 'processing': return 2;
      case 'shipped': return 3;
      case 'delivered': return 4;
      default: return 1;
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-serif font-bold text-center mb-4">Track Your Order</h1>
      <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
        Enter your order number to track your shipment and see delivery updates.
      </p>

      {/* Search Form */}
      <div className="max-w-xl mx-auto mb-12">
        <form onSubmit={handleTrackOrder} className="flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Enter your order number (e.g., ORD-XXXXXXXXXX)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300 flex items-center gap-2 disabled:bg-gray-400"
          >
            <FiSearch />
            {loading ? 'Tracking...' : 'Track'}
          </button>
        </form>
        {error && (
          <p className="text-red-500 mt-4 text-center">{error}</p>
        )}
      </div>

      {/* Order Status Display */}
      {orderStatus && (
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Order #{orderStatus.order_number}</h2>
            <p className="text-gray-600">
              Placed on {new Date(orderStatus.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            {orderStatus.tracking_number && (
              <p className="text-gray-600 mt-1">
                Tracking Number: <span className="font-medium">{orderStatus.tracking_number}</span>
              </p>
            )}
          </div>

          {/* Status Timeline */}
          <div className="relative">
            <div className="flex justify-between items-center mb-8">
              {/* Order Placed */}
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  getStatusStep(orderStatus.status) >= 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  <FiCheckCircle size={24} />
                </div>
                <span className="mt-2 text-sm font-medium">Order Placed</span>
              </div>

              {/* Processing */}
              <div className="flex-1 h-1 mx-4 bg-gray-200">
                <div className={`h-full ${getStatusStep(orderStatus.status) >= 2 ? 'bg-green-500' : ''}`} 
                     style={{ width: getStatusStep(orderStatus.status) >= 2 ? '100%' : '0%' }}></div>
              </div>

              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  getStatusStep(orderStatus.status) >= 2 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  <FiPackage size={24} />
                </div>
                <span className="mt-2 text-sm font-medium">Processing</span>
              </div>

              {/* Shipped */}
              <div className="flex-1 h-1 mx-4 bg-gray-200">
                <div className={`h-full ${getStatusStep(orderStatus.status) >= 3 ? 'bg-green-500' : ''}`}
                     style={{ width: getStatusStep(orderStatus.status) >= 3 ? '100%' : '0%' }}></div>
              </div>

              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  getStatusStep(orderStatus.status) >= 3 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  <FiTruck size={24} />
                </div>
                <span className="mt-2 text-sm font-medium">Shipped</span>
              </div>

              {/* Delivered */}
              <div className="flex-1 h-1 mx-4 bg-gray-200">
                <div className={`h-full ${getStatusStep(orderStatus.status) >= 4 ? 'bg-green-500' : ''}`}
                     style={{ width: getStatusStep(orderStatus.status) >= 4 ? '100%' : '0%' }}></div>
              </div>

              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  getStatusStep(orderStatus.status) >= 4 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  <FiCheckCircle size={24} />
                </div>
                <span className="mt-2 text-sm font-medium">Delivered</span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-6 mt-6">
            <h3 className="font-semibold mb-4">Order Summary</h3>
            <div className="flex justify-between text-gray-600">
              <span>Items in order:</span>
              <span>{orderStatus.items}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg mt-2">
              <span>Total:</span>
              <span>₹{orderStatus.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="max-w-3xl mx-auto mt-12 text-center">
        <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
        <p className="text-gray-600">
          If you have questions about your order, please contact our customer support at{' '}
          <a href="mailto:support@mahafashion.com" className="text-blue-600 hover:underline">
            support@mahafashion.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default TrackOrderPage;
