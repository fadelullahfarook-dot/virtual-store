import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { ProductConfig } from '../../types';
import { Text, Image } from '@react-three/drei';

interface ProductDisplayProps {
  product: ProductConfig;
}

export const ProductDisplay: React.FC<ProductDisplayProps> = ({ product }) => {
  const groupRef = useRef<any>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
    }
  });

  const getImageUrl = () => {
    if (product.imageUrl) return product.imageUrl;
    
    // Fallbacks with CORS-friendly Unsplash URLs
    if (product.category === 'electronics') {
      if (product.name.toLowerCase().includes('phone')) return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80';
      if (product.name.toLowerCase().includes('laptop')) return 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80';
      return 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80';
    }
    if (product.category === 'fashion') {
      if (product.name.toLowerCase().includes('shirt')) return 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80';
      if (product.name.toLowerCase().includes('jeans')) return 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80';
      if (product.name.toLowerCase().includes('sneaker')) return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80';
      return 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80';
    }
    if (product.category === 'furniture') {
      return 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&q=80';
    }
    if (product.category === 'grocery') {
      if (product.name.toLowerCase().includes('novel')) return 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80';
      return 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80';
    }
    return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80';
  };

  return (
    <group position={product.position} rotation={product.rotation || [0, 0, 0]}>
      {/* Display stand/table if needed */}
      {product.displayType === 'table' && (
        <mesh position={[0, 0.5, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[0.6, 0.6, 1, 16]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      )}
      
      {product.displayType === 'rack' && (
        <mesh position={[0, 1, 0]} receiveShadow castShadow>
          <boxGeometry args={[1, 2, 0.2]} />
          <meshStandardMaterial color="#dddddd" />
        </mesh>
      )}

      {/* The Product Picture itself */}
      <group position={[0, product.displayType === 'floor' ? 0.8 : (product.displayType === 'table' ? 1.5 : 2.0), 0]}>
        
        {/* DEBUG RED BOX */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="red" />
        </mesh>

        <group ref={groupRef}>
          <React.Suspense fallback={
            <mesh>
              <planeGeometry args={[0.8, 0.8]} />
              <meshStandardMaterial color="#cccccc" />
            </mesh>
          }>
            {/* Double-sided Image */}
            <Image url={getImageUrl()} scale={[0.8, 0.8]} transparent position={[0, 0, 0.01]} />
            <Image url={getImageUrl()} scale={[0.8, 0.8]} transparent rotation={[0, Math.PI, 0]} position={[0, 0, -0.01]} />
          </React.Suspense>
        </group>
        
        {/* Product label */}
        <group position={[0, 0.6, 0]}>
          <Text
            position={[0, 0, 0]}
            fontSize={0.15}
            color="black"
            anchorX="center"
            anchorY="bottom"
            fillOpacity={1}
            outlineWidth={0.01}
            outlineColor="white"
          >
            {product.name}
          </Text>
          <Text
            position={[0, -0.18, 0]}
            fontSize={0.12}
            color="#e63946"
            anchorX="center"
            anchorY="bottom"
            fillOpacity={1}
            outlineWidth={0.01}
            outlineColor="white"
          >
            ₹{product.price.toLocaleString('en-IN')}
          </Text>
        </group>
      </group>
    </group>
  );
};

