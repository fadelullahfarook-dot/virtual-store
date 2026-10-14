import React from 'react';
import type { StoreConfig } from '../../../types';
import { ProductDisplay } from './ProductDisplay';
import { Shelf } from './Shelf';
import { Counter } from './Counter';

interface StoreInteriorProps {
  store: StoreConfig;
}

export const StoreInterior: React.FC<StoreInteriorProps> = ({ store }) => {
  const { size, products, category } = store;
  const [w, h, d] = size;
  
  // Custom colors per category
  const wallColor = category === 'electronics' ? '#f0f4f8' :
                    category === 'fashion' ? '#fff0f5' :
                    category === 'grocery' ? '#f5fffa' : '#ffffff';
  
  const floorColor = category === 'electronics' ? '#2c3e50' :
                     category === 'fashion' ? '#dcdcdc' :
                     category === 'grocery' ? '#e0eee0' : '#d3d3d3';

  return (
    <group>
      {/* Floor */}
      <mesh position={[0, 0.05, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color={floorColor} roughness={0.8} />
      </mesh>
      
      {/* Ceiling */}
      <mesh position={[0, h, 0]} receiveShadow rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, h / 2, -d / 2]} receiveShadow>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>
      
      {/* Left Wall */}
      <mesh position={[-w / 2, h / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[d, h]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[w / 2, h / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[d, h]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>
      
      {/* Front Wall (with entrance) */}
      <group position={[0, h / 2, d / 2]} rotation={[0, Math.PI, 0]}>
        <mesh position={[-w / 4 - 1, 0, 0]} receiveShadow>
          <planeGeometry args={[w / 2 - 2, h]} />
          <meshStandardMaterial color={wallColor} />
        </mesh>
        <mesh position={[w / 4 + 1, 0, 0]} receiveShadow>
          <planeGeometry args={[w / 2 - 2, h]} />
          <meshStandardMaterial color={wallColor} />
        </mesh>
        {/* Door Header */}
        <mesh position={[0, h / 2 - 1, 0]} receiveShadow>
          <planeGeometry args={[4, 2]} />
          <meshStandardMaterial color={wallColor} />
        </mesh>
      </group>
      
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[0, h - 1, 0]} intensity={1.2} distance={15} castShadow />
      <pointLight position={[-w/3, h - 1, -d/3]} intensity={0.8} distance={10} color="#ffeedd" />
      <pointLight position={[w/3, h - 1, d/3]} intensity={0.8} distance={10} color="#ddf0ff" />
      
      {/* Default interior props based on category */}
      {category === 'electronics' && (
        <>
          <Counter position={[0, 0, -d/2 + 2]} />
        </>
      )}
      
      {category === 'fashion' && (
        <>
          <Shelf position={[-w/2 + 1.5, 0, -1]} rotation={[0, Math.PI / 2, 0]} />
          <Shelf position={[w/2 - 1.5, 0, -1]} rotation={[0, -Math.PI / 2, 0]} />
        </>
      )}

      {category === 'grocery' && (
        <>
          <Shelf position={[-w/2 + 1.5, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
          <Shelf position={[w/2 - 1.5, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
          <Shelf position={[0, 0, -d/2 + 1.5]} rotation={[0, 0, 0]} />
        </>
      )}
      
      {/* Products */}
      {products.map((product) => (
        <ProductDisplay key={product.id || product._id} product={product} />
      ))}
    </group>
  );
};
