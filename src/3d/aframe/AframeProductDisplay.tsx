import React from 'react';
import type { ProductConfig } from '../../types';

interface AframeProductDisplayProps {
  product: ProductConfig;
  onSelectProduct?: (product: ProductConfig) => void;
}

export const AframeProductDisplay: React.FC<AframeProductDisplayProps> = ({ 
  product,
  onSelectProduct
}) => {
  const getImageUrl = () => {
    if (product.imageUrl && !product.imageUrl.includes('placehold.co')) {
      return product.imageUrl;
    }
    
    // Category fallbacks matching original ProductDisplay.tsx
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
    if (product.category === 'furniture') {
      return '/images/sofa.jpg';
    }
    if (product.category === 'grocery') {
      if (product.name.toLowerCase().includes('novel')) return 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80';
      return 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80';
    }
    return product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80';
  };

  const [px, rawPy, pz] = product.position;
  // Ensure product does not clip under floor if negative Y is provided in database
  const py = rawPy !== undefined && rawPy >= 0 ? rawPy : 0.5;
  const [rx, ry, rz] = (product.rotation || [0, 0, 0]).map(r => (r * 180) / Math.PI);

  const displayType = product.displayType || 'table';
  const itemY = displayType === 'floor' ? 0.8 : (displayType === 'table' ? 1.5 : 2.0);
  const productId = product.id || product._id || '';

  return (
    <a-entity 
      id={`product-group-${productId}`}
      position={`${px} ${py} ${pz}`} 
      rotation={`${rx} ${ry} ${rz}`}
    >
      {/* Table Display Stand */}
      {displayType === 'table' && (
        <a-entity position="0 0 0">
          <a-cylinder 
            position="0 0.5 0" 
            radius="0.6" 
            height="1" 
            color="#ffffff"
            material="roughness: 0.3"
            shadow="cast: true; receive: true"
          ></a-cylinder>
          {/* Metallic rim base */}
          <a-cylinder 
            position="0 0.04 0" 
            radius="0.65" 
            height="0.08" 
            color="#cbd5e1"
            material="roughness: 0.2; metalness: 0.6"
          ></a-cylinder>
        </a-entity>
      )}

      {/* Rack Display Stand */}
      {displayType === 'rack' && (
        <a-box 
          position="0 1 0" 
          width="1" 
          height="2" 
          depth="0.2" 
          color="#e2e8f0" 
          material="roughness: 0.4"
          shadow="cast: true; receive: true"
        ></a-box>
      )}

      {/* Floor Display Pedestal */}
      {displayType === 'floor' && (
        <a-cylinder
          position="0 0.1 0"
          radius="0.9"
          height="0.2"
          color="#334155"
          material="roughness: 0.4"
          shadow="cast: true; receive: true"
        ></a-cylinder>
      )}

      {/* Interactive Clickable Area for Raycaster / Cursor */}
      <a-entity 
        position={`0 ${itemY} 0`}
        class="clickable product-entity"
        data-product-id={productId}
        onClick={() => onSelectProduct && onSelectProduct(product)}
      >
        {/* Invisible Click Target Collider */}
        <a-box
          position="0 0.2 0"
          width="1.3"
          height="1.6"
          depth="1.3"
          material="transparent: true; opacity: 0; visible: false"
          class="clickable"
        ></a-box>

        {/* Continuous Rotating Product Image (smooth Y rotation) */}
        <a-entity 
          animation="property: rotation; to: 0 360 0; loop: true; dur: 8000; easing: linear"
        >
          {/* Double-sided Image */}
          <a-image 
            src={getImageUrl()} 
            width="0.85" 
            height="0.85" 
            position="0 0 0.01"
            material="side: double; transparent: true; alphaTest: 0.1"
          ></a-image>
          <a-image 
            src={getImageUrl()} 
            width="0.85" 
            height="0.85" 
            position="0 0 -0.01" 
            rotation="0 180 0"
            material="side: double; transparent: true; alphaTest: 0.1"
          ></a-image>
        </a-entity>

        {/* Double-sided Product Labels */}
        <a-entity position="0 0.75 0">
          {/* Front Name & Price */}
          <a-text 
            value={product.name} 
            position="0 0.12 0.01" 
            align="center" 
            color="#0f172a" 
            width="3.5"
            wrap-count="20"
          ></a-text>
          <a-text 
            value={`Rs. ${product.price.toLocaleString('en-IN')}`} 
            position="0 -0.1 0.01" 
            align="center" 
            color="#e11d48" 
            width="4"
          ></a-text>

          {/* Reverse Side Name & Price */}
          <a-text 
            value={product.name} 
            position="0 0.12 -0.01" 
            rotation="0 180 0"
            align="center" 
            color="#0f172a" 
            width="3.5"
            wrap-count="20"
          ></a-text>
          <a-text 
            value={`Rs. ${product.price.toLocaleString('en-IN')}`} 
            position="0 -0.1 -0.01" 
            rotation="0 180 0"
            align="center" 
            color="#e11d48" 
            width="4"
          ></a-text>
        </a-entity>
      </a-entity>
    </a-entity>
  );
};
