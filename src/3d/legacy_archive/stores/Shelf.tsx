import React from 'react';

export const Shelf: React.FC<{ position: [number, number, number], rotation?: [number, number, number] }> = ({ position, rotation = [0, 0, 0] }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Base/Back */}
      <mesh position={[0, 2, -0.4]} receiveShadow castShadow>
        <boxGeometry args={[3, 4, 0.1]} />
        <meshStandardMaterial color="#dddddd" />
      </mesh>
      {/* Shelves */}
      <mesh position={[0, 1, 0]} receiveShadow castShadow>
        <boxGeometry args={[3, 0.1, 0.8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[3, 0.1, 0.8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 3, 0]} receiveShadow castShadow>
        <boxGeometry args={[3, 0.1, 0.8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
};
