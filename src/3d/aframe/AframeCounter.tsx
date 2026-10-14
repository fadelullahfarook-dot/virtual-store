import React from 'react';

interface AframeCounterProps {
  position: [number, number, number];
}

export const AframeCounter: React.FC<AframeCounterProps> = ({ position }) => {
  const [x, y, z] = position;
  return (
    <a-box 
      position={`${x} ${y + 1} ${z}`} 
      width="4" 
      height="2" 
      depth="1.5" 
      color="#333333"
      material="roughness: 0.5"
      shadow="cast: true; receive: true"
    ></a-box>
  );
};
