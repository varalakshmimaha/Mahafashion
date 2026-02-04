import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import getImageUrl from '../utils/getImageUrl';

const STATUS_OPTIONS = ['PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURNED'];
const PAYMENT_OPTIONS = ['pending', 'paid', 'failed', 'refunded'];

const AdminOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Order Data
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Editable Fields
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [trackingId, setTrackingId] = useState('');

  // UI State
  const [hasChanges, setHasChanges] = useState(false);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await orderAPI.adminShow(id);
      setOrder(res);
      setStatus(res.status || '');
      setPaymentStatus(res.payment_status || '');
      setTrackingId(res.tracking_id || ''); // Assuming tracking_id field exists
      setHasChanges(false);
    } catch (e) {
      console.error('adminShow', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  // Track changes
  useEffect(() => {
    if (!order) return;
    const isStatusChanged = status !== (order.status || '');
    const isPaymentChanged = paymentStatus !== (order.payment_status || '');
    const isTrackingChanged = trackingId !== (order.tracking_id || '');

    setHasChanges(isStatusChanged || isPaymentChanged || isTrackingChanged);
  }, [status, paymentStatus, trackingId, order]);

  const handleUpdate = async () => {
    if (!id) return;
    try {
      // Update status if changed
      if (status !== order.status) {
        await orderAPI.adminUpdateStatus(id, status);
      }
      // Update payment if changed
      if (paymentStatus !== order.payment_status) {
        await orderAPI.adminUpdatePayment(id, paymentStatus);
      }
      // Update details (tracking) if changed - assuming adminUpdate handles this or we need a specific endpoint
      if (trackingId !== order.tracking_id) {
        await orderAPI.adminUpdate(id, { tracking_id: trackingId });
      }

      alert('Order updated successfully');
      await load();
    } catch (e: any) {
      alert(e.message || 'Failed to update order');
    }
  };

  const downloadInvoice = async () => {
    if (!id) return;
    try {
      const blob = await orderAPI.downloadInvoice(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) { alert('Failed to download invoice'); }
  };

  const removeOrder = async () => {
    if (!id) return;
    if (!confirm('Are you sure you want to PERMANENTLY delete this order?')) return;
    try {
      await orderAPI.adminDelete(id);
      navigate('/admin/orders');
    } catch (e) { alert('Failed to delete order'); }
  };

  if (loading) return <div className="p-8 text-gray-500">Loading order details...</div>;
  if (!order) return <div className="p-8 text-red-500">Order not found</div>;

  // Calculation safe-guards
  const items = order.order_items || [];
  const subtotal = items.reduce((sum: number, item: any) => {
    const price = Number(item.price || item.unit_price || 0);
    const qty = Number(item.qty || item.quantity || item.quantity_ordered || 0);
    return sum + (price * qty);
  }, 0);

  // Tax and Shipping - fallback to order total difference if fields missing?
  // Assuming backend might send tax/shipping, else 0 for now based on prompt "fix ₹0.00"
  const shipping = Number(order.shipping_cost || 0);
  const tax = Number(order.tax_amount || 0);
  const grandTotal = subtotal + shipping + tax;

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="w-full min-h-screen bg-gray-50/30 text-sm font-sans text-gray-800 pb-20">
      {/* 2. Order Header Section */}
      <div className="flex flex-wrap items-center gap-6 px-8 py-6 border-b border-gray-200 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-500 uppercase text-xs">Order ID</span>
          <span className="font-mono text-lg font-bold">#{order.id}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-500 uppercase text-xs">Order No</span>
          <span className="font-mono">{order.order_number || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-500 uppercase text-xs">Date</span>
          <span>{formatDate(order.created_at)}</span>
        </div>

        {/* Editable Status Dropdowns */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="font-bold text-gray-500 uppercase text-xs">Status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-transparent border-b border-gray-300 py-1 pr-8 focus:outline-none focus:border-gray-800 font-medium hover:bg-gray-50 cursor-pointer"
          >
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-500 uppercase text-xs">Payment</span>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className={`bg-transparent border-b border-gray-300 py-1 pr-8 focus:outline-none focus:border-gray-800 font-medium hover:bg-gray-50 cursor-pointer ${paymentStatus === 'paid' ? 'text-green-700' : 'text-amber-700'}`}
          >
            {PAYMENT_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* 3. Customer & Shipping Info */}
      <div className="px-8 py-8 flex flex-wrap gap-16">
        <div className="min-w-[200px]">
          <h4 className="font-bold text-gray-900 mb-2 uppercase text-xs tracking-wider">Customer Details</h4>
          <div className="space-y-1">
            <p className="font-medium text-lg">{order.user?.name || order.guest_name || 'Guest'}</p>
            <p className="text-gray-600">{order.user?.email || order.email || 'N/A'}</p>
            <p className="text-gray-600">{order.user?.phone || order.phone || 'N/A'}</p>
          </div>
        </div>

        <div className="min-w-[200px]">
          <h4 className="font-bold text-gray-900 mb-2 uppercase text-xs tracking-wider">Shipping Address</h4>
          <div className="space-y-1 text-gray-600">
            {order.shipping_address ? (
              <>
                <p className="font-medium text-gray-900">{order.shipping_address.name}</p>
                <p>{order.shipping_address.street || order.shipping_address.address}</p>
                <p>
                  {order.shipping_address.city}, {order.shipping_address.state}
                </p>
                <p>
                  {order.shipping_address.country || 'India'} - {order.shipping_address.zip || order.shipping_address.pincode}
                </p>
              </>
            ) : order.primary_address ? (
              <>
                <p>{order.primary_address.line1 || order.primary_address.address}</p>
                <p>{order.primary_address.city} {order.primary_address.state}</p>
                <p>{order.primary_address.country} {order.primary_address.zip_code}</p>
              </>
            ) : (
              <p className="text-gray-400 italic">No shipping address provided</p>
            )}
          </div>
        </div>

        <div className="min-w-[200px]">
          <h4 className="font-bold text-gray-900 mb-2 uppercase text-xs tracking-wider">Order Note</h4>
          <p className="text-gray-600 italic max-w-xs">{order.notes || order.description || 'No notes'}</p>
        </div>
      </div>

      <hr className="border-gray-200 mx-8 mb-8" />

      {/* 4. Order Items Table */}
      <div className="px-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
              <th className="py-3 font-medium w-16">Image</th>
              <th className="py-3 font-medium">Product</th>
              <th className="py-3 font-medium bg-gray-50/0 text-center">SKU</th>
              <th className="py-3 font-medium text-right">Price</th>
              <th className="py-3 font-medium text-center">Quantity</th>
              <th className="py-3 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item: any, idx: number) => {
              const price = Number(item.price || item.unit_price || 0);
              const qty = Number(item.qty || item.quantity || item.quantity_ordered || 0);
              const total = price * qty;

              return (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="py-3 pr-4">
                    <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden">
                      <img
                        src={getImageUrl(item)}
                        alt={item.product?.name || item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="font-medium text-gray-900">{item.product?.name || item.name}</div>
                    {(item.selected_color || item.color) && (
                      <div className="text-xs text-gray-500">Color: {item.selected_color || item.color}</div>
                    )}
                    {(item.selected_size || item.size) && (
                      <div className="text-xs text-gray-500">Size: {item.selected_size || item.size}</div>
                    )}
                  </td>
                  <td className="py-3 text-center text-gray-500 font-mono text-xs">
                    {item.product?.sku || 'N/A'}
                  </td>
                  <td className="py-3 text-right font-mono">
                    ₹{price.toLocaleString()}
                  </td>
                  <td className="py-3 text-center">
                    {qty}
                  </td>
                  <td className="py-3 text-right font-bold font-mono">
                    ₹{total.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 5. Order Totals */}
      <div className="px-8 mt-6 flex flex-col items-end space-y-1 text-right">
        <div className="w-64 flex justify-between">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-mono">₹{subtotal.toLocaleString()}</span>
        </div>
        <div className="w-64 flex justify-between">
          <span className="text-gray-500">Shipping</span>
          <span className="font-mono">{shipping === 0 ? 'Free' : `₹${shipping.toLocaleString()}`}</span>
        </div>
        {tax > 0 && (
          <div className="w-64 flex justify-between">
            <span className="text-gray-500">Tax</span>
            <span className="font-mono">₹{tax.toLocaleString()}</span>
          </div>
        )}
        <div className="w-64 flex justify-between pt-3 mt-2 border-t border-gray-200 text-lg font-bold">
          <span>Grand Total</span>
          <span className="font-mono text-gray-900">₹{grandTotal.toLocaleString()}</span>
        </div>
      </div>

      {/* 6. Update Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-8 py-4 flex items-center justify-between z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-4 w-1/3">
          <span className="text-xs font-bold uppercase text-gray-500 whitespace-nowrap">Tracking ID</span>
          <input
            type="text"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="Enter tracking number"
            className="border-b border-gray-300 py-1 px-2 w-full focus:outline-none focus:border-gray-900 font-mono text-sm bg-transparent"
          />
        </div>

        <div className="flex items-center gap-4">
          {hasChanges && (
            <span className="text-xs text-amber-600 font-medium animate-pulse">
              Unsaved Changes
            </span>
          )}

          <button
            onClick={removeOrder}
            className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded text-sm font-medium transition-colors"
          >
            Delete Order
          </button>

          <button
            onClick={downloadInvoice}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded text-sm font-medium transition-colors"
          >
            Print Invoice
          </button>

          {hasChanges && (
            <button
              onClick={handleUpdate}
              className="px-6 py-2 bg-gray-900 text-white hover:bg-gray-800 rounded text-sm font-medium transition-colors shadow-sm"
            >
              Update Changes
            </button>
          )}
        </div>
      </div>

      {/* Spacer for fixed footer */}
      <div className="h-20"></div>
    </div>
  );
};

export default AdminOrderDetailPage;
