import React from 'react';

interface AframeShelfProps {
  position: [number, number, number];
  rotation?: [number, number, number];
}

export const AframeShelf: React.FC<AframeShelfProps> = ({ 
  position, 
  rotation = [0, 0, 0] 
}) => {
  const [x, y, z] = position;
  const [rx, ry, rz] = rotation.map(r => (r * 180) / Math.PI);

  return (
    <a-entity 
      position={`${x} ${y} ${z}`} 
      rotation={`${rx} ${ry} ${rz}`}
      shadow="receive: true; cast: true"
    >
      {/* Base / Back board */}
      <a-box 
        position="0 2 -0.4" 
        width="3" 
        height="4" 
        depth="0.1" 
        color="#dddddd"
        material="roughness: 0.7"
        shadow="cast: true; receive: true"
      ></a-box>

      {/* Shelf level 1 */}
      <a-box 
        position="0 1 0" 
        width="3" 
        height="0.1" 
        depth="0.8" 
        color="#ffffff"
        material="roughness: 0.6"
        shadow="cast: true; receive: true"
      ></a-box>

      {/* Shelf level 2 */}
      <a-box 
        position="0 2 0" 
        width="3" 
        height="0.1" 
        depth="0.8" 
        color="#ffffff"
        material="roughness: 0.6"
        shadow="cast: true; receive: true"
      ></a-box>

      {/* Shelf level 3 */}
      <a-box 
        position="0 3 0" 
        width="3" 
        height="0.1" 
        depth="0.8" 
        color="#ffffff"
        material="roughness: 0.6"
        shadow="cast: true; receive: true"
      ></a-box>
    </a-entity>
  );
};
