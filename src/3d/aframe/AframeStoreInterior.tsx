import React from 'react';
import type { StoreConfig, ProductConfig } from '../../types';
import { AframeProductDisplay } from './AframeProductDisplay';
import { AframeShelf } from './AframeShelf';
import { AframeCounter } from './AframeCounter';

interface AframeStoreInteriorProps {
  store: StoreConfig;
  onSelectProduct?: (product: ProductConfig) => void;
  onExitStore?: () => void;
}

export const AframeStoreInterior: React.FC<AframeStoreInteriorProps> = ({ 
  store,
  onSelectProduct,
  onExitStore
}) => {
  const { size, products, category, id } = store;
  const [w, h, d] = size;

  // Custom colors per category replicating StoreInterior.tsx
  const wallColor = category === 'electronics' ? '#f0f4f8' :
                    category === 'fashion' ? '#fff0f5' :
                    category === 'grocery' ? '#f5fffa' : '#ffffff';
  
  const floorColor = category === 'electronics' ? '#2c3e50' :
                     category === 'fashion' ? '#dcdcdc' :
                     category === 'grocery' ? '#e0eee0' : '#d3d3d3';

  return (
    <a-entity id={`store-interior-${id}`}>
      {/* Floor */}
      <a-plane 
        position={`0 0.05 0`} 
        rotation="-90 0 0" 
        width={`${w}`} 
        height={`${d}`} 
        color={floorColor} 
        material="roughness: 0.8"
        shadow="receive: true"
      ></a-plane>

      {/* Ceiling */}
      <a-plane 
        position={`0 ${h} 0`} 
        rotation="90 0 0" 
        width={`${w}`} 
        height={`${d}`} 
        color="#ffffff" 
        material="roughness: 0.9"
        shadow="receive: true"
      ></a-plane>

      {/* Back Wall */}
      <a-plane 
        position={`0 ${h / 2} ${-d / 2 + 0.02}`} 
        rotation="0 0 0" 
        width={`${w}`} 
        height={`${h}`} 
        color={wallColor} 
        material="roughness: 0.7; side: double"
        shadow="receive: true"
      ></a-plane>

      {/* Left Wall */}
      <a-plane 
        position={`${-w / 2 + 0.02} ${h / 2} 0`} 
        rotation="0 90 0" 
        width={`${d}`} 
        height={`${h}`} 
        color={wallColor} 
        material="roughness: 0.7; side: double"
        shadow="receive: true"
      ></a-plane>

      {/* Right Wall */}
      <a-plane 
        position={`${w / 2 - 0.02} ${h / 2} 0`} 
        rotation="0 -90 0" 
        width={`${d}`} 
        height={`${h}`} 
        color={wallColor} 
        material="roughness: 0.7; side: double"
        shadow="receive: true"
      ></a-plane>

      {/* Front Wall Interior (with door opening) */}
      <a-plane 
        position={`${-w / 4 - 1} ${h / 2} ${d / 2 - 0.02}`} 
        rotation="0 180 0" 
        width={`${w / 2 - 2}`} 
        height={`${h}`} 
        color={wallColor} 
        material="roughness: 0.7; side: double"
        shadow="receive: true"
      ></a-plane>

      <a-plane 
        position={`${w / 4 + 1} ${h / 2} ${d / 2 - 0.02}`} 
        rotation="0 180 0" 
        width={`${w / 2 - 2}`} 
        height={`${h}`} 
        color={wallColor} 
        material="roughness: 0.7; side: double"
        shadow="receive: true"
      ></a-plane>

      {/* Door Header Interior */}
      <a-plane 
        position={`0 ${h - 1} ${d / 2 - 0.02}`} 
        rotation="0 180 0" 
        width="4" 
        height="2" 
        color={wallColor} 
        material="roughness: 0.7; side: double"
        shadow="receive: true"
      ></a-plane>

      {/* Exit Sign above Door */}
      <a-entity position={`0 4.5 ${d / 2 - 0.1}`} rotation="0 180 0">
        <a-box width="1.4" height="0.45" depth="0.08" color="#059669"></a-box>
        <a-text value="EXIT" position="0 0 0.05" align="center" color="#ffffff" width="3.5"></a-text>
      </a-entity>

      {/* Exit Doorway Clickable Area & Frame */}
      <a-entity
        position={`0 2 ${d / 2 - 0.2}`}
        rotation="0 180 0"
        class="clickable exit-door-trigger"
        onClick={() => onExitStore && onExitStore()}
      >
        {/* Door Outline Frame */}
        <a-box position="-1.3 0 0" width="0.12" height="4" depth="0.1" color="#334155"></a-box>
        <a-box position="1.3 0 0" width="0.12" height="4" depth="0.1" color="#334155"></a-box>
        <a-box position="0 2 0" width="2.7" height="0.12" depth="0.1" color="#334155"></a-box>

        <a-box
          position="0 0 0"
          width="2.6"
          height="4"
          depth="0.5"
          material="transparent: true; opacity: 0; visible: false"
          class="clickable"
        ></a-box>
      </a-entity>

      {/* Interior Lighting */}
      <a-light 
        type="point" 
        position={`0 ${h - 1} 0`} 
        intensity="1.2" 
        distance="15" 
        color="#ffffff"
        castShadow="true"
      ></a-light>
      <a-light 
        type="point" 
        position={`${-w / 3} ${h - 1} ${-d / 3}`} 
        intensity="0.8" 
        distance="10" 
        color="#ffeedd"
      ></a-light>
      <a-light 
        type="point" 
        position={`${w / 3} ${h - 1} ${d / 3}`} 
        intensity="0.8" 
        distance="10" 
        color="#ddf0ff"
      ></a-light>

      {/* Category-specific Fixtures */}
      {category === 'electronics' && (
        <AframeCounter position={[0, 0, -d / 2 + 2]} />
      )}

      {category === 'fashion' && (
        <>
          <AframeShelf position={[-w / 2 + 1.5, 0, -1]} rotation={[0, Math.PI / 2, 0]} />
          <AframeShelf position={[w / 2 - 1.5, 0, -1]} rotation={[0, -Math.PI / 2, 0]} />
        </>
      )}

      {category === 'grocery' && (
        <>
          <AframeShelf position={[-w / 2 + 1.5, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
          <AframeShelf position={[w / 2 - 1.5, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
          <AframeShelf position={[0, 0, -d / 2 + 1.5]} rotation={[0, 0, 0]} />
        </>
      )}

      {/* Products Displayed in Store */}
      {products.map((product) => (
        <AframeProductDisplay 
          key={product.id || product._id} 
          product={product} 
          onSelectProduct={onSelectProduct}
        />
      ))}
    </a-entity>
  );
};
