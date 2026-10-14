import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import type { ProductConfig } from '../types';

export const ProductInfoPanel: React.FC = () => {
  const navigate = useNavigate();
  const { selectedProduct, setSelectedProduct, addToCart, isAuthenticated } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);

  if (!selectedProduct) return null;

  const product = selectedProduct as ProductConfig;
  const hasVariants = product.variants && product.variants.length > 0;
  const selectedVariant = hasVariants ? product.variants![selectedVariantIndex] : null;
  const currentPrice = selectedVariant?.additionalPrice
    ? product.price + selectedVariant.additionalPrice
    : product.price;

  const getProductImage = () => {
    if (product.imageUrl && !product.imageUrl.includes('placehold.co')) return product.imageUrl;
    if (product.category === 'electronics') {
      if (product.name.toLowerCase().includes('phone')) return '/images/smartphone.jpg';
      if (product.name.toLowerCase().includes('laptop')) return '/images/laptop.jpg';
      return '/images/smartphone.jpg';
    }
    if (product.category === 'fashion') {
      if (product.name.toLowerCase().includes('shirt')) return '/images/tshirt.jpg';
      if (product.name.toLowerCase().includes('jeans')) return '/images/jeans.jpg';
      if (product.name.toLowerCase().includes('sneaker')) return '/images/sneakers.jpg';
      return '/images/tshirt.jpg';
    }
    if (product.category === 'furniture') return '/images/sofa.jpg';
    if (product.category === 'grocery') {
      if (product.name.toLowerCase().includes('novel')) return 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80';
    }
    return product.imageUrl || '/images/smartphone.jpg';
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      if (window.confirm("Please log in to add items to your cart. Proceed to Login page?")) {
        navigate('/login');
      }
      return;
    }
    const variantData = selectedVariant ? { color: selectedVariant.color, size: selectedVariant.size } : undefined;
    const prodId = product.id || (product as any)._id;

    if (!prodId) {
      alert("Product ID is missing.");
      return;
    }

    try {
      await addToCart(prodId, quantity, variantData);
      alert("Item added to cart successfully!");
      setSelectedProduct(null);
    } catch (error: any) {
      if (
        error.message?.includes('session has expired') ||
        error.message?.includes('Please log in') ||
        error.message?.includes('Not authorized') ||
        error.message?.includes('token failed')
      ) {
        if (window.confirm("Your session has expired or you need to log in to add items to your cart. Proceed to Login page?")) {
          navigate('/login');
        }
      } else {
        alert("Error adding item to cart: " + error.message);
      }
    }
  };

  return (
    <div className="absolute right-8 top-8 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
      <div className="bg-gray-100 h-40 flex items-center justify-center overflow-hidden">
        <img
          src={getProductImage()}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg text-gray-900">{product.name}</h3>
            <div className="flex gap-2 mt-1">
              {product.company && (
                <span className="inline-block px-2 py-1 bg-indigo-100 text-xs font-medium text-indigo-700 rounded capitalize">
                  {product.company}
                </span>
              )}
              <span className="inline-block px-2 py-1 bg-gray-100 text-xs font-medium text-gray-600 rounded capitalize">
                {product.category || 'Product'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setSelectedProduct(null)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {product.description}
        </p>

        {hasVariants && (
          <div className="mt-3">
            <label className="text-xs font-semibold text-gray-700 block mb-1">Variant</label>
            <select
              value={selectedVariantIndex}
              onChange={(e) => setSelectedVariantIndex(Number(e.target.value))}
              className="w-full text-sm border-gray-300 rounded-md p-1 border"
            >
              {product.variants!.map((v, idx) => (
                <option key={idx} value={idx}>
                  {v.color || ''} {v.size || ''} {v.additionalPrice ? `(+₹${v.additionalPrice})` : ''} - {v.stock} in stock
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mt-3 flex items-center gap-3">
          <label className="text-xs font-semibold text-gray-700">Quantity</label>
          <div className="flex items-center border rounded-md">
            <button
              className="px-2 py-1 text-gray-600 hover:bg-gray-100"
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
            >-</button>
            <span className="px-3 text-sm">{quantity}</span>
            <button
              className="px-2 py-1 text-gray-600 hover:bg-gray-100"
              onClick={() => setQuantity(q => q + 1)}
            >+</button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="font-extrabold text-xl text-indigo-600">
            ₹{currentPrice.toLocaleString('en-IN')}
          </div>

          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
