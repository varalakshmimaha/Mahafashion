import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderAPI, API_STORAGE_URL } from '../services/api';
import OrderSummary from '../components/order/OrderSummary';
import VerticalStatusTracker from '../components/order/VerticalStatusTracker';
import ItemsList from '../components/order/ItemsList';
import PriceBreakdown from '../components/order/PriceBreakdown';
import AddressBlock from '../components/order/AddressBlock';
import DeliveryInfo from '../components/order/DeliveryInfo';
import ActionButtons from '../components/order/ActionButtons';
import { useNotification } from '../context/NotificationContext';

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await orderAPI.getOrderById(id);
        console.log('========== ORDER API DEBUG ==========');
        console.log('🔍 RAW API Response:', data);
        console.log('📝 Response Type:', typeof data);
        console.log('📋 Response Keys:', Object.keys(data || {}));

        // Normalize response shape: some API helpers return { data: order }
        const normalized = data?.data || data;
        console.log('📦 Normalized Order Data:', normalized);
        console.log('📋 Normalized Keys:', Object.keys(normalized || {}));
        console.log('🛒 Items Array:', normalized?.items);
        console.log('📊 Items Array Type:', typeof normalized?.items);
        console.log('📊 Items Array is Array?:', Array.isArray(normalized?.items));
        console.log('📊 Items Count:', normalized?.items?.length);
        console.log('📊 Items Count Field:', normalized?.items_count);
        console.log('=====================================');

        setOrder(normalized);
      } catch (err: any) {
        console.error('❌ Order Load Error:', err);
        addNotification(err.message || 'Failed to load order', 'error');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, addNotification]);

  const handleDownloadInvoice = async () => {
    if (!order) return;
    try {
      // Always use the API download method which includes authentication
      const blob = await orderAPI.downloadInvoice(order.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${order.order_number || order.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      addNotification(err.message || 'Failed to download invoice', 'error');
    }
  };

  const handleCancel = async () => {
    if (!order) return;

    const reason = window.prompt("Please provide a reason for cancellation (required):");
    if (reason === null) return; // User clicked Cancel in prompt
    if (!reason.trim()) {
      addNotification('Cancellation reason is required', 'error');
      return;
    }

    try {
      const updated = await orderAPI.cancelOrder(order.id, { reason: reason.trim() });
      setOrder(updated);
      addNotification('Order cancelled', 'success');
    } catch (err: any) {
      addNotification(err.message || 'Failed to cancel order', 'error');
    }
  };

  const handleReturn = async () => {
    if (!order) return;

    const reason = window.prompt("Please provide a reason for return (required):");
    if (reason === null) return; // User clicked Cancel in prompt
    if (!reason.trim()) {
      addNotification('Return reason is required', 'error');
      return;
    }

    try {
      const updated = await orderAPI.returnOrder(order.id, { reason: reason.trim() });
      setOrder(updated);
      addNotification('Return initiated', 'success');
    } catch (err: any) {
      addNotification(err.message || 'Failed to initiate return', 'error');
    }
  };

  const handleTrack = () => {
    if (!order?.shipping?.tracking_id) return;
    // If external link exists, open; otherwise navigate to track page
    window.open(order.shipping.tracking_url || `https://track.example.com/${order.shipping.tracking_id}`, '_blank');
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-48 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Order not found or you don't have access to view this order.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <OrderSummary
        orderId={order.order_number || order.id}
        placedAt={order.placed_at}
        status={order.status}
        paymentMethod={order.payment_method}
        paymentStatus={order.payment_status}
        total={order.total}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <VerticalStatusTracker status={order.status} statusHistory={order.status_history || []} cancelReason={order.cancel_reason} returnReason={order.return_reason} cancelledAt={order.cancelled_at} />
          <ItemsList items={order.items || []} status={order.status} />
          <PriceBreakdown pricing={{ subtotal: order.subtotal || 0, discount: order.discount || 0, shipping: order.shipping || 0, tax: order.tax || 0 }} total={order.total || 0} />
        </div>

        <div className="space-y-4">
          <AddressBlock address={order.address} />
          <DeliveryInfo shipping={order.shipping} />
          <ActionButtons
            status={order.status}
            paymentMethod={order.payment_method}
            invoiceUrl={order.invoice_url}
            onCancel={handleCancel}
            onReturn={handleReturn}
            onTrack={handleTrack}
            onDownloadInvoice={handleDownloadInvoice}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
