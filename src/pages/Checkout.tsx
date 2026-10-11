import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, createOrder, isAuthenticated } = useStore();
  
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!cart || cart.items.length === 0) {
      navigate('/store');
    }
  }, [isAuthenticated, cart, navigate]);

  if (!cart || cart.items.length === 0) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Simulate payment processing if it's test online payment
    if (paymentMethod === 'Test Online Payment') {
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    try {
      const order = await createOrder(address, paymentMethod);
      if (order) {
        navigate('/order-success');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const deliveryFee = 100;
  const total = cart.subtotal + deliveryFee;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input required name="fullName" value={address.fullName} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input required name="phone" value={address.phone} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line</label>
                <input required name="addressLine" value={address.addressLine} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input required name="city" value={address.city} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input required name="state" value={address.state} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <input required name="postalCode" value={address.postalCode} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input required name="country" value={address.country} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="payment" value="Cash on Delivery" checked={paymentMethod === 'Cash on Delivery'} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4 text-indigo-600" />
                <span className="font-medium">Cash on Delivery</span>
              </label>
              <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="payment" value="Test Online Payment" checked={paymentMethod === 'Test Online Payment'} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4 text-indigo-600" />
                <span className="font-medium">Test Online Payment</span>
              </label>
            </div>
          </div>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-4 mb-4 max-h-60 overflow-y-auto pr-2">
              {cart.items.map((item, idx) => {
                const name = typeof item.productId === 'object' ? (item.productId as any).name : 'Product';
                return (
                  <div key={idx} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium text-gray-900">{name}</p>
                      <p className="text-gray-500">Qty: {item.quantity}</p>
                      {item.selectedVariant && <p className="text-gray-500 text-xs">{item.selectedVariant.color} / {item.selectedVariant.size}</p>}
                    </div>
                    <p className="font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                );
              })}
            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{cart.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span>₹{deliveryFee.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                <span>Total</span>
                <span className="text-indigo-600">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg mt-6 disabled:opacity-50 transition-colors flex justify-center items-center"
            >
              {loading ? (paymentMethod === 'Test Online Payment' ? 'Processing Payment...' : 'Placing Order...') : 'Place Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
