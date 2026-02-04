import React, { useState } from 'react';
import { FiSearch, FiPackage, FiTruck, FiCheckCircle } from 'react-icons/fi';
import { orderAPI } from '../services/api';
import { useNotification } from '../context/NotificationContext';

interface OrderStatus {
  id: string;
  order_number: string;
  status: string;
  items: number;
  total: number;
  created_at?: string | null;
  status_history?: any;
  tracking_number?: string;
}

const TrackOrderPage = () => {
  const { addNotification } = useNotification();
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
    setOrderStatus(null);

      try {
      // Try fetching by numeric id first (if user entered numeric id)
      let response: any = null;

      try {
        response = await orderAPI.getOrderById(orderNumber);
      } catch (firstErr) {
        // fallback: try public track by order number
        response = await orderAPI.trackByNumber(orderNumber);
      }

      // Normalize response shape (some endpoints return { data: order })
      const order = response?.data || response;

      // Derive placed date from backend `status_history` when available,
      // otherwise try several common fallback fields returned by different endpoints.
      let placedAt: string | null = null;
      const statusHistory = order?.status_history;
      const tryStatusEntry = (entry: any) => {
        if (!entry) return null;
        const st = (entry?.status || entry?.name || '').toString().toLowerCase();
        if (['placed', 'order placed', 'pending', 'created'].includes(st)) {
          return entry.timestamp || entry.created_at || entry.date || entry.at || null;
        }
        return null;
      };

      if (Array.isArray(statusHistory)) {
        for (const s of statusHistory) {
          const v = tryStatusEntry(s);
          if (v) { placedAt = v; break; }
        }
      } else if (statusHistory && typeof statusHistory === 'object') {
        // status_history might be an object keyed by status name
        for (const v of Object.values(statusHistory)) {
          const found = tryStatusEntry(v as any);
          if (found) { placedAt = found; break; }
        }
      }

      // Other common fallback fields some endpoints use
      const fallbackFields = ['placed_at','placedAt','placed_on','placedOn','order_date','orderDate','created_at','createdAt','created'];
      if (!placedAt) {
        for (const key of fallbackFields) {
          if (order && (order[key] !== undefined && order[key] !== null)) {
            placedAt = order[key];
            break;
          }
        }
      }

      // Final normalize: ensure string or null
      if (placedAt && typeof placedAt !== 'string') placedAt = String(placedAt);
      if (!placedAt) placedAt = null;

      const itemsCount = Array.isArray(order?.order_items)
        ? order.order_items.length
        : Array.isArray(order?.items)
          ? order.items.length
          : (typeof order?.items === 'number' ? order.items : 0);

      setOrderStatus({
        id: order?.id,
        order_number: order?.order_number,
        status: order?.status || '',
        items: itemsCount,
        total: order?.total ?? 0,
        created_at: placedAt,
        status_history: order?.status_history,
        tracking_number: order?.tracking_number ?? null
      });
    } catch (err: any) {
      console.error('Error tracking order:', err);
      setError(err.message || 'Order not found. Please check your order number and try again.');
      addNotification(err.message || 'Unable to track order. Please try again later.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status?: string) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'pending': return 1;
      case 'confirmed': return 1;
      case 'processing': return 2;
      case 'shipped': return 3;
      case 'delivered': return 4;
      case 'cancelled': return 5;
      default: return 1;
    }
  };
  
  const getStatusLabel = (status?: string) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'processing': return 'Processing';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status || '';
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
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-300 flex items-center gap-2 disabled:bg-gray-400"
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
              Placed on {orderStatus.created_at ? (isNaN(new Date(orderStatus.created_at).getTime()) ? 'N/A' : new Date(orderStatus.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })) : 'N/A'}
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
                  getStatusStep(orderStatus.status) >= 1 && orderStatus.status !== 'cancelled' ? 'bg-green-500 text-white' : orderStatus.status === 'cancelled' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  <FiCheckCircle size={24} />
                </div>
                <span className="mt-2 text-sm font-medium">Order Placed</span>
              </div>

              {/* Processing */}
              <div className="flex-1 h-1 mx-4 bg-gray-200">
                <div className={`h-full ${(getStatusStep(orderStatus.status) >= 2 && orderStatus.status !== 'cancelled') ? 'bg-green-500' : orderStatus.status === 'cancelled' ? 'bg-red-500' : ''}`} 
                     style={{ width: (getStatusStep(orderStatus.status) >= 2 && orderStatus.status !== 'cancelled') ? '100%' : orderStatus.status === 'cancelled' ? '50%' : '0%' }}></div>
              </div>

              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  getStatusStep(orderStatus.status) >= 2 && orderStatus.status !== 'cancelled' ? 'bg-green-500 text-white' : orderStatus.status === 'cancelled' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  <FiPackage size={24} />
                </div>
                <span className="mt-2 text-sm font-medium">Processing</span>
              </div>

              {/* Shipped */}
              <div className="flex-1 h-1 mx-4 bg-gray-200">
                <div className={`h-full ${(getStatusStep(orderStatus.status) >= 3 && orderStatus.status !== 'cancelled') ? 'bg-green-500' : orderStatus.status === 'cancelled' ? 'bg-red-500' : ''}`}
                     style={{ width: (getStatusStep(orderStatus.status) >= 3 && orderStatus.status !== 'cancelled') ? '100%' : orderStatus.status === 'cancelled' ? '100%' : '0%' }}></div>
              </div>

              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  getStatusStep(orderStatus.status) >= 3 && orderStatus.status !== 'cancelled' ? 'bg-green-500 text-white' : orderStatus.status === 'cancelled' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500'
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
                  getStatusStep(orderStatus.status) >= 4 ? 'bg-green-500 text-white' : getStatusStep(orderStatus.status) >= 5 ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  <FiCheckCircle size={24} />
                </div>
                <span className="mt-2 text-sm font-medium">{getStatusStep(orderStatus.status) >= 5 ? 'Cancelled' : 'Delivered'}</span>
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
            <div className="flex justify-between text-gray-600 mt-2">
              <span>Status:</span>
              <span className={`font-semibold ${orderStatus.status === 'cancelled' ? 'text-red-600' : 'text-green-600'}`}>
                {getStatusLabel(orderStatus.status)}
              </span>
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
