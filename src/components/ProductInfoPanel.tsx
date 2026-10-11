import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import type { ProductConfig } from '../types';

export const ProductInfoPanel: React.FC = () => {
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

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert("Please login to add to cart");
      return;
    }
    const variantData = selectedVariant ? { color: selectedVariant.color, size: selectedVariant.size } : undefined;
    
    try {
      await addToCart(product.id!, quantity, variantData);
      alert("Item added to cart successfully!");
      setSelectedProduct(null);
    } catch (error: any) {
      alert("Error adding item to cart: " + error.message);
    }
  };

  return (
    <div className="absolute right-8 top-8 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
      <div className="bg-gray-100 h-40 flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-20 h-20 bg-gray-300 rounded-md flex items-center justify-center text-gray-500 font-bold">Image</div>
        )}
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
