import React from 'react';

interface TreeProps {
  position: [number, number, number];
}

export const Tree: React.FC<TreeProps> = ({ position }) => {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.5, 3, 5]} />
        <meshStandardMaterial color="#5c4033" />
      </mesh>
      
      {/* Leaves */}
      <mesh position={[0, 4, 0]} castShadow receiveShadow>
        <coneGeometry args={[2, 4, 6]} />
        <meshStandardMaterial color="#228b22" />
      </mesh>
      <mesh position={[0, 5.5, 0]} castShadow receiveShadow>
        <coneGeometry args={[1.5, 3, 6]} />
        <meshStandardMaterial color="#2eb82e" />
      </mesh>
    </group>
  );
};
