import React from 'react';

export const Counter: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <mesh position={position} receiveShadow castShadow>
      <boxGeometry args={[4, 2, 1.5]} />
      <meshStandardMaterial color="#333333" />
    </mesh>
  );
};
