import React from 'react';

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
  created_at: string;
  status: string;
  payment_method: string;
  payment_status: string;
  sub_total: number;
  shipping_fee: number;
  tax_amount?: number;
  total_amount?: number;
  total?: number;
  order_items: OrderItem[];
  address: Address;
  user?: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
}

interface InvoiceComponentProps {
  order: Order;
  showActions?: boolean;
}

const InvoiceComponent: React.FC<InvoiceComponentProps> = ({
  order,
  showActions = true
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real implementation, this would generate a PDF
    alert('Invoice download functionality would be implemented here');
  };

  return (
    <div className="invoice-container bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      {/* Invoice Header */}
      <div className="invoice-header border-b pb-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">INVOICE</h1>
            <p className="text-gray-600 mt-2">Order #{order.order_number}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-semibold">Maha Fashion</h2>
            <p className="text-gray-600">123 Fashion Street</p>
            <p className="text-gray-600">Mumbai, Maharashtra 400001</p>
            <p className="text-gray-600">India</p>
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="invoice-details grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Bill To:</h3>
          <p className="font-medium">{order.user?.name || order.address.name}</p>
          <p>{order.user?.email || order.address.email}</p>
          <p>{order.user?.phone || order.address.phone}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Shipping Address:</h3>
          <p>{order.address.street}</p>
          <p>{order.address.city}, {order.address.state} {order.address.zip}</p>
          <p>{order.address.country}</p>
        </div>
        <div className="text-right">
          <div className="mb-2">
            <p className="text-gray-600">Invoice Date:</p>
            <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-600">Order Date:</p>
            <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="order-items mb-8">
        <h3 className="text-lg font-semibold mb-4">Order Items</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">Product</th>
                <th className="border p-3 text-right">Price</th>
                <th className="border p-3 text-center">Qty</th>
                <th className="border p-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {(order.order_items || []).map((item) => (
                <tr key={item?.id ?? Math.random()} className="border-b">
                  <td className="border p-3">
                    <div className="font-medium">{item?.product?.name || 'Product'}</div>
                  </td>
                  <td className="border p-3 text-right">₹{Number(item?.price ?? item?.total_price ?? 0).toLocaleString('en-IN')}</td>
                  <td className="border p-3 text-center">{item?.quantity ?? 0}</td>
                  <td className="border p-3 text-right">₹{Number(item?.total_price ?? (item?.price && item?.quantity ? item.price * item.quantity : 0)).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Summary */}
      <div className="order-summary bg-gray-50 p-6 rounded-lg mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div></div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{Number(order.sub_total || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>₹{Number(order.shipping_fee || 0).toLocaleString('en-IN')}</span>
            </div>
            {order.tax_amount !== undefined && (
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>₹{Number(order.tax_amount || 0).toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-gray-300 font-bold text-lg">
              <span>Total:</span>
              <span>₹{Number(order.total_amount ?? order.total ?? 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="payment-info mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Payment Method:</h3>
            <p className="capitalize">{(order.payment_method || '').replace('_', ' ')}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Payment Status:</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.payment_status === 'paid'
                ? 'bg-green-100 text-green-800'
                : (order.payment_status === 'pending' || !order.payment_status)
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
              {(order.payment_status || 'pending').charAt(0).toUpperCase() + (order.payment_status || 'pending').slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Invoice Actions */}
      {showActions && (
        <div className="invoice-actions flex justify-end space-x-4 pt-6 border-t">
          <button
            onClick={handlePrint}
            className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Print Invoice
          </button>
          <button
            onClick={handleDownload}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Download PDF
          </button>
        </div>
      )}

      {/* Hidden styles for print */}
      <style>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .invoice-container {
            box-shadow: none;
            border: 1px solid #e5e7eb;
          }
          .invoice-actions {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default InvoiceComponent;