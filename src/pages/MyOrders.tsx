import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export const MyOrders: React.FC = () => {
  const navigate = useNavigate();
  const { orders, fetchOrders, isAuthenticated } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const loadData = async () => {
      await fetchOrders();
      setLoading(false);
    };
    loadData();
  }, [isAuthenticated, fetchOrders, navigate]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><p className="text-gray-500">Loading orders...</p></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 min-h-[calc(100vh-64px)]">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500 mb-4">You have no orders yet.</p>
          <Link to="/store" className="text-indigo-600 font-bold hover:underline">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:shadow-md transition-shadow">
              <div>
                <p className="font-bold text-lg text-gray-900">{order.orderNumber}</p>
                <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()} • {order.items.length} {order.items.length === 1 ? 'item' : 'items'}</p>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="font-bold text-gray-900">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                  <p className={`text-xs font-semibold px-2 py-1 rounded mt-1 inline-block
                    ${order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' : 
                      order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}
                  >
                    {order.orderStatus}
                  </p>
                </div>
                
                <Link 
                  to={`/orders/${order._id}`}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
