import React from 'react';

export const AframeRoad: React.FC = () => {
  return (
    <a-entity id="road-system">
      {/* Main Street Road Plane */}
      <a-plane 
        position="0 0 0" 
        rotation="-90 0 0" 
        width="10" 
        height="200" 
        color="#333333" 
        material="roughness: 0.9"
        shadow="receive: true"
      ></a-plane>

      {/* Center Line Markings */}
      {Array.from({ length: 20 }).map((_, i) => (
        <a-plane 
          key={i}
          position={`0 0.02 ${-100 + i * 10 + 5}`}
          rotation="-90 0 0"
          width="0.25"
          height="5"
          color="#ffffff"
          material="shader: flat"
        ></a-plane>
      ))}

      {/* Left Sidewalk */}
      <a-plane 
        position="-7 0.05 0" 
        rotation="-90 0 0" 
        width="4" 
        height="200" 
        color="#aaaaaa" 
        material="roughness: 0.8"
        shadow="receive: true"
      ></a-plane>

      {/* Right Sidewalk */}
      <a-plane 
        position="7 0.05 0" 
        rotation="-90 0 0" 
        width="4" 
        height="200" 
        color="#aaaaaa" 
        material="roughness: 0.8"
        shadow="receive: true"
      ></a-plane>
    </a-entity>
  );
};
