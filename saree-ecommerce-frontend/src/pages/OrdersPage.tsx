import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import DashboardTabs from '../components/dashboard/DashboardTabs';

interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  product?: {
    id: number;
    name: string;
    image_url: string;
  };
}

interface Order {
  id: number;
  order_number: string;
  created_at: string;
  total: number;
  status: string;
  payment_method: string;
  payment_status: string;
  order_items?: OrderItem[];
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await orderAPI.getOrders();
        setOrders(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
        // If unauthorized, clear auth and show friendly message
        if ((err as any)?.status === 401) {
          setError('Session expired. Please login again.');
          // Remove stored auth and reload so AuthContext resets
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        } else {
          setError((err as any)?.message || 'Failed to load orders');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower === 'delivered') return 'bg-green-100 text-green-800';
    if (statusLower === 'shipped') return 'bg-blue-100 text-blue-800';
    if (statusLower === 'confirmed') return 'bg-purple-100 text-purple-800';
    if (statusLower === 'cancelled') return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const formatStatus = (status: string) => {
    return status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase() || 'Pending';
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Please login to view your orders.</p>
          <Link to="/login" className="inline-block px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors">
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-serif font-bold mb-8">My Orders</h1>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-serif font-bold mb-8">My Orders</h1>
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <DashboardTabs />
      <h1 className="text-3xl font-serif font-bold mb-8">My Orders</h1>

      <div className="max-w-4xl mx-auto">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">You haven't placed any orders yet.</p>
            <Link to="/products" className="mt-4 inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Order # {order.order_number}</h3>
                    <p className="text-gray-600">Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {formatStatus(order.status)}
                    </span>
                    {order.payment_method && (
                      <span className="text-xs text-gray-500">
                        {order.payment_method.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600">
                      {order.order_items?.length || 0} item{(order.order_items?.length || 0) !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">₹{Number(order.total).toLocaleString()}</p>
                    <Link
                      to={`/order/${order.id}`}
                      className="text-sm text-primary hover:text-primary-dark underline"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
