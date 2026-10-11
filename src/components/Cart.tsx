import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export const Cart: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { cart, updateCartItem, removeFromCart } = useStore();

  const cartItemsCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <>
      {/* Cart Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-24 right-8 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition z-40"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {cartItemsCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {cartItemsCount}
          </span>
        )}
      </button>

      {/* Cart Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)}></div>
          <div className="w-96 bg-white h-full shadow-2xl flex flex-col relative z-10">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">Shopping Cart</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-800 text-xl font-bold">×</button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {!cart || cart.items.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                cart.items.map((item, idx) => {
                  const pId = typeof item.productId === 'object' ? (item.productId as any)._id : item.productId;
                  const name = typeof item.productId === 'object' ? (item.productId as any).name : 'Product';
                  return (
                  <div key={idx} className="flex gap-4 border-b pb-4">
                    <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">Img</div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-gray-900">{name}</h3>
                      {item.selectedVariant && (
                        <p className="text-xs text-gray-500">
                          {item.selectedVariant.color} / {item.selectedVariant.size}
                        </p>
                      )}
                      <div className="flex justify-between items-end mt-2">
                        <div className="flex items-center border rounded">
                          <button 
                            className="px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
                            onClick={() => updateCartItem(pId, item.quantity - 1, item.selectedVariant)}
                            disabled={item.quantity <= 1}
                          >-</button>
                          <span className="px-2 text-sm">{item.quantity}</span>
                          <button 
                            className="px-2 py-1 hover:bg-gray-100"
                            onClick={() => updateCartItem(pId, item.quantity + 1, item.selectedVariant)}
                          >+</button>
                        </div>
                        <div className="font-bold text-indigo-600">₹{item.price.toLocaleString('en-IN')}</div>
                      </div>
                      <button 
                        onClick={() => removeFromCart(pId, item.selectedVariant?.color, item.selectedVariant?.size)}
                        className="text-xs text-red-500 hover:text-red-700 mt-2 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )})
              )}
            </div>
            
            <div className="p-4 border-t bg-gray-50">
              <div className="flex justify-between mb-4">
                <span className="font-bold text-gray-700">Subtotal</span>
                <span className="font-bold text-xl text-gray-900">₹{cart?.subtotal?.toLocaleString('en-IN') || 0}</span>
              </div>
              <button 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!cart || cart.items.length === 0}
                onClick={() => {
                  setIsOpen(false);
                  navigate('/checkout');
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
