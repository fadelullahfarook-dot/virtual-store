import React from 'react';
import type { StoreConfig } from '../../types';

interface AframeStoreExteriorProps {
  store: StoreConfig;
  onEnterStore?: (storeId: string) => void;
}

export const AframeStoreExterior: React.FC<AframeStoreExteriorProps> = ({ 
  store,
  onEnterStore
}) => {
  const { size, color, name, id } = store;
  const [w, h, d] = size;

  return (
    <a-entity id={`store-exterior-${id}`}>
      {/* Back Wall */}
      <a-box 
        position={`0 ${h / 2} ${-d / 2}`} 
        width={`${w}`} 
        height={`${h}`} 
        depth="0.5" 
        color={color}
        material="roughness: 0.6"
        shadow="cast: true; receive: true"
      ></a-box>

      {/* Left Wall */}
      <a-box 
        position={`${-w / 2} ${h / 2} 0`} 
        width="0.5" 
        height={`${h}`} 
        depth={`${d}`} 
        color={color}
        material="roughness: 0.6"
        shadow="cast: true; receive: true"
      ></a-box>

      {/* Right Wall */}
      <a-box 
        position={`${w / 2} ${h / 2} 0`} 
        width="0.5" 
        height={`${h}`} 
        depth={`${d}`} 
        color={color}
        material="roughness: 0.6"
        shadow="cast: true; receive: true"
      ></a-box>

      {/* Roof */}
      <a-box 
        position={`0 ${h} 0`} 
        width={`${w + 0.5}`} 
        height="0.5" 
        depth={`${d + 0.5}`} 
        color={color}
        material="roughness: 0.6"
        shadow="cast: true; receive: true"
      ></a-box>

      {/* Front Wall Left */}
      <a-box 
        position={`${-w / 4 - 0.5} ${h / 2} ${d / 2}`} 
        width={`${w / 2 - 1}`} 
        height={`${h}`} 
        depth="0.5" 
        color={color}
        material="roughness: 0.6"
        shadow="cast: true; receive: true"
      ></a-box>

      {/* Front Wall Right */}
      <a-box 
        position={`${w / 4 + 0.5} ${h / 2} ${d / 2}`} 
        width={`${w / 2 - 1}`} 
        height={`${h}`} 
        depth="0.5" 
        color={color}
        material="roughness: 0.6"
        shadow="cast: true; receive: true"
      ></a-box>

      {/* Front Wall Top (Door Header) */}
      <a-box 
        position={`0 ${h - 2} ${d / 2}`} 
        width="3" 
        height="4" 
        depth="0.5" 
        color={color}
        material="roughness: 0.6"
        shadow="cast: true; receive: true"
      ></a-box>

      {/* Front Left Window */}
      <a-box 
        position={`-2.5 3 ${d / 2 + 0.26}`} 
        width="1.5" 
        height="3" 
        depth="0.05" 
        color="#88ccff"
        material="transparent: true; opacity: 0.45; roughness: 0.1"
      ></a-box>

      {/* Front Right Window */}
      <a-box 
        position={`2.5 3 ${d / 2 + 0.26}`} 
        width="1.5" 
        height="3" 
        depth="0.05" 
        color="#88ccff"
        material="transparent: true; opacity: 0.45; roughness: 0.1"
      ></a-box>

      {/* Shop Sign Board */}
      <a-box 
        position={`0 ${h - 1} ${d / 2 + 0.3}`} 
        width="6" 
        height="1.5" 
        depth="0.2" 
        color="#222222"
        material="roughness: 0.3"
        shadow="cast: true"
      >
        {/* Store Sign Text */}
        <a-text 
          value={name} 
          position="0 0 0.12" 
          align="center" 
          color="#ffffff" 
          width="6.5"
          wrap-count="18"
        ></a-text>
      </a-box>

      {/* Clickable Doorway Trigger with Door Frame & Welcome Mat */}
      <a-entity
        position={`0 2.5 ${d / 2 + 0.1}`}
        class="clickable store-entrance-trigger"
        data-store-id={id}
        onClick={() => onEnterStore && onEnterStore(id)}
      >
        {/* Entrance Portal Frame */}
        <a-box position="-1.4 0 0" width="0.15" height="5" depth="0.25" color="#1e293b"></a-box>
        <a-box position="1.4 0 0" width="0.15" height="5" depth="0.25" color="#1e293b"></a-box>
        <a-box position="0 2.45 0" width="2.95" height="0.15" depth="0.25" color="#1e293b"></a-box>
        
        {/* Welcome Threshold */}
        <a-plane position="0 -2.48 0.4" rotation="-90 0 0" width="2.6" height="0.8" color="#0f172a"></a-plane>

        {/* Click Target */}
        <a-box
          position="0 0 0"
          width="2.8"
          height="5"
          depth="0.8"
          material="transparent: true; opacity: 0; visible: false"
          class="clickable"
        ></a-box>
      </a-entity>
    </a-entity>
  );
};
