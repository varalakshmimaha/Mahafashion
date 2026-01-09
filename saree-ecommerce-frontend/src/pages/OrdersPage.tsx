import React from 'react';
import { Link } from 'react-router-dom';

const OrdersPage = () => {
  // Mock order data
  const orders = [
    {
      id: 'ORD-001',
      date: '2025-12-15',
      total: 12998,
      status: 'Delivered',
      items: 2,
    },
    {
      id: 'ORD-002',
      date: '2025-12-01',
      total: 8999,
      status: 'Shipped',
      items: 1,
    },
    {
      id: 'ORD-003',
      date: '2025-11-20',
      total: 15499,
      status: 'Pending',
      items: 3,
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-serif font-bold mb-8">My Orders</h1>
      
      <div className="max-w-4xl mx-auto">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">You haven't placed any orders yet.</p>
            <Link to="/products" className="mt-4 inline-block px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Order # {order.id}</h3>
                    <p className="text-gray-600">Placed on {new Date(order.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600">{order.items} item{order.items !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">₹{order.total.toLocaleString()}</p>
                    <Link 
                      to={`/order/${order.id}`} 
                      className="text-sm text-gray-600 hover:text-gray-900 underline"
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
