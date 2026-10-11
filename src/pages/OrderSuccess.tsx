import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export const OrderSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { currentOrder, isAuthenticated } = useStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!currentOrder) {
      navigate('/store');
    }
  }, [isAuthenticated, currentOrder, navigate]);

  if (!currentOrder) return null;

  return (
    <div className="flex-grow flex items-center justify-center p-4 bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100 text-center">
        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
        <p className="text-gray-500 mb-6">Thank you for your purchase. Your order has been confirmed.</p>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-8 text-left space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">Order Number:</span>
            <span className="font-bold text-gray-900">{currentOrder.orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">Total Amount:</span>
            <span className="font-bold text-indigo-600">₹{currentOrder.totalAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">Status:</span>
            <span className="font-medium text-gray-900">{currentOrder.orderStatus}</span>
          </div>
        </div>

        <div className="space-y-3">
          <Link 
            to={`/orders/${currentOrder._id}`}
            className="block w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            View Order Details
          </Link>
          <Link 
            to="/store"
            className="block w-full bg-white text-indigo-600 font-bold py-3 px-4 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};
