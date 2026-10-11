import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentOrder, fetchOrderById, cancelOrder, isAuthenticated } = useStore();
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const loadData = async () => {
      if (id) {
        await fetchOrderById(id);
      }
      setLoading(false);
    };
    loadData();
  }, [id, isAuthenticated, fetchOrderById, navigate]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><p className="text-gray-500">Loading order details...</p></div>;
  }

  if (!currentOrder) {
    return <div className="flex justify-center items-center h-64"><p className="text-red-500">Order not found.</p></div>;
  }

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      setCancelling(true);
      setError('');
      try {
        await cancelOrder(currentOrder._id);
      } catch (err: any) {
        setError(err.message || 'Failed to cancel order');
      } finally {
        setCancelling(false);
      }
    }
  };

  const canCancel = currentOrder.orderStatus === 'Pending' || currentOrder.orderStatus === 'Confirmed';

  const orderStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
  const currentIndex = orderStatuses.indexOf(currentOrder.orderStatus);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link to="/orders" className="text-indigo-600 hover:underline text-sm font-medium mb-2 inline-block">← Back to My Orders</Link>
          <h1 className="text-2xl font-bold text-gray-900">Order #{currentOrder.orderNumber}</h1>
          <p className="text-sm text-gray-500">Placed on {new Date(currentOrder.createdAt).toLocaleDateString()} at {new Date(currentOrder.createdAt).toLocaleTimeString()}</p>
        </div>
        {canCancel && (
          <button 
            onClick={handleCancel}
            disabled={cancelling}
            className="bg-white border border-red-200 text-red-600 hover:bg-red-50 font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {cancelling ? 'Cancelling...' : 'Cancel Order'}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      {currentOrder.orderStatus !== 'Cancelled' ? (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
          <h3 className="font-bold text-gray-900 mb-4">Tracking Status</h3>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative">
            {orderStatuses.map((status, index) => {
              const isCompleted = index <= currentIndex;
              const isCurrent = index === currentIndex;
              return (
                <div key={status} className="flex flex-row md:flex-col items-center flex-1 z-10 gap-3 md:gap-2 mb-4 md:mb-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2
                    ${isCompleted ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  <span className={`text-sm font-medium ${isCurrent ? 'text-indigo-600' : isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                    {status}
                  </span>
                </div>
              );
            })}
            <div className="hidden md:block absolute top-4 left-8 right-8 h-0.5 bg-gray-200 z-0">
              <div 
                className="h-full bg-indigo-600 transition-all duration-500" 
                style={{ width: `${(currentIndex / (orderStatuses.length - 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-red-50 p-4 rounded-xl border border-red-100 mb-6 flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">!</span>
          <div>
            <h3 className="font-bold text-red-800">Order Cancelled</h3>
            <p className="text-red-600 text-sm">This order has been cancelled and cannot be processed.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <h3 className="font-bold text-gray-900 p-6 border-b bg-gray-50">Items Ordered</h3>
            <div className="p-6 space-y-4">
              {currentOrder.items.map((item, idx) => (
                <div key={idx} className="flex gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">Img</div>
                  <div className="flex-grow">
                    <h4 className="font-semibold text-gray-900">{item.productName}</h4>
                    {item.selectedVariant && (
                      <p className="text-xs text-gray-500">{item.selectedVariant.color} / {item.selectedVariant.size}</p>
                    )}
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-gray-600">Qty: {item.quantity} x ₹{item.price.toLocaleString('en-IN')}</p>
                      <p className="font-bold text-gray-900">₹{item.subtotal.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{currentOrder.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>₹{currentOrder.deliveryFee.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                <span>Total</span>
                <span className="text-indigo-600">₹{currentOrder.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b">Payment Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Method:</span>
                <span className="font-medium text-gray-900">{currentOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Status:</span>
                <span className={`font-medium ${currentOrder.paymentStatus === 'Paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {currentOrder.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b">Delivery Address</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-bold text-gray-900">{currentOrder.shippingAddress.fullName}</p>
              <p>{currentOrder.shippingAddress.addressLine}</p>
              <p>{currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} {currentOrder.shippingAddress.postalCode}</p>
              <p>{currentOrder.shippingAddress.country}</p>
              <p className="pt-2 mt-2 border-t">Phone: {currentOrder.shippingAddress.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
