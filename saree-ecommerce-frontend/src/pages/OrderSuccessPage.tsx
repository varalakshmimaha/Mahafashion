import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { orderAPI } from '../services/api';
import Button from '../components/ui/Button';

interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  total_price: number;
  product?: {
    id: number;
    name: string;
    image_url: string;
  };
}

interface Address {
  id: number;
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface Order {
  id: number;
  order_number: string;
  total: number;
  sub_total: number;
  shipping_fee: number;
  tax_amount?: number;
  status: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
  order_items: OrderItem[];
  address: Address;
  user?: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
}

const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('order_id');
  const orderNumber = searchParams.get('order_number');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        let payload = null;
        if (orderNumber) {
          // Use public endpoint for better guest support
          const resp = await orderAPI.trackByNumber(orderNumber);
          payload = resp?.data || resp;
        } else if (orderId) {
          // Fallback to ID for legacy/auth flows
          const resp = await orderAPI.getOrderById(orderId);
          payload = resp?.data || resp;
        }

        if (payload) {
          // Normalize data structure differences between endpoints
          // API 'track' returns raw model (shipping_address, order_items)
          // API 'show' returns transformed (address, items)

          // 1. Ensure 'address' exists
          if (!payload.address && payload.shipping_address) {
            payload.address = payload.shipping_address;
          }

          // 2. Ensure 'order_items' exists with 'product' relation
          if (!payload.order_items && payload.items) {
            // Transform flat 'items' (from show endpoint) to nested 'order_items' (for component)
            payload.order_items = payload.items.map((item: any) => ({
              id: item.id,
              product_id: item.product_id,
              quantity: item.quantity,
              price: item.price,
              total_price: item.price * item.quantity,
              product: {
                id: item.product_id,
                name: item.product_name || item.name || 'Product',
                image_url: item.product_image || item.image || ''
              }
            }));
          } else if (payload.order_items) {
            // Ensure order_items have product structure if they came from raw model but might be missing something
            // Usually trackByNumber returns order_items with product relation loaded, so this is fine.
          }

          setOrder(payload);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderNumber || orderId) {
      fetchOrder();
    } else {
      setLoading(false);
    }
  }, [orderId, orderNumber]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maroon-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 mb-8 text-center">
            Thank you for your order. We've received your order and will begin processing it soon.
          </p>

          {/* Prominent Order Number for Tracking */}
          {order && (
            <div className="text-center mb-10">
              <div className="inline-block bg-gray-50 border-2 border-dashed border-maroon-200 rounded-xl p-6 min-w-[280px] sm:min-w-[350px]">
                <p className="text-gray-500 text-sm uppercase tracking-wider font-semibold mb-2">Order Tracking ID</p>
                <p className="text-3xl sm:text-4xl font-extrabold text-maroon-600 tracking-tight font-mono select-all cursor-text py-1">
                  {order.order_number}
                </p>
                <p className="text-xs text-gray-400 mt-2">Save this ID to track your order status</p>
              </div>
            </div>
          )}



          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 pt-8 border-t border-gray-200">
            <Button
              onClick={() => navigate('/orders')}
              variant="primary"
              className="gap-2"
            >
              View My Orders
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => navigate('/products')}
              variant="secondary"
            >
              Continue Shopping
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              A confirmation email has been sent to your registered email address.
              You can track your order status from the "My Orders" section.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
