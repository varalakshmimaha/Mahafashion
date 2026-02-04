import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';

const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const fetchOrders = async (p = 1) => {
    setLoading(true);
    try {
      const res = await orderAPI.adminList({ page: p });
      // Support pagination shape: data or items
      const list = res?.data || res?.items || res || [];
      setOrders(Array.isArray(list) ? list : (list.data || []));
    } catch (e) {
      console.error('adminList error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(page); }, [page]);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Orders</h2>
        <button className="btn" onClick={() => fetchOrders(page)}>Refresh</button>
      </div>

      {loading ? <div>Loading...</div> : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th>Order#</th>
              <th>User</th>
              <th>Address</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Amount</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o: any) => (
              <tr key={o.id} className="border-t">
                <td>{o.order_number || `#${o.id}`}</td>
                <td>{o.user?.name || o.user_name || o.customer_name || '—'}</td>
                <td>{(o.primary_address && (o.primary_address.line1 || o.primary_address.address)) || (o.primary_address && (o.primary_address.city || '')) || '—'}</td>
                <td>{o.status}</td>
                <td>{o.payment_status}</td>
                <td>{o.grand_total || o.total || '—'}</td>
                <td>{o.created_at ? new Date(o.created_at).toLocaleString() : '—'}</td>
                <td>
                  <button className="btn mr-2" onClick={() => navigate(`/admin/orders/${o.id}`)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-4 flex items-center gap-2">
        <button className="btn" onClick={() => setPage(p => Math.max(1, p-1))}>Prev</button>
        <span>Page {page}</span>
        <button className="btn" onClick={() => setPage(p => p+1)}>Next</button>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
