import React from 'react';
import { Text } from '@react-three/drei';
import type { StoreConfig } from '../../types';

interface StoreExteriorProps {
  store: StoreConfig;
}

export const StoreExterior: React.FC<StoreExteriorProps> = ({ store }) => {
  const { size, color, name } = store;
  
  const [w, h, d] = size;

  return (
    <group>
      {/* Back Wall */}
      <mesh position={[0, h/2, -d/2]} receiveShadow castShadow>
        <boxGeometry args={[w, h, 0.5]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Left Wall */}
      <mesh position={[-w/2, h/2, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.5, h, d]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Right Wall */}
      <mesh position={[w/2, h/2, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.5, h, d]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Roof */}
      <mesh position={[0, h, 0]} receiveShadow castShadow>
        <boxGeometry args={[w + 0.5, 0.5, d + 0.5]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Front Wall (with cutout for door) */}
      {/* Left side of door */}
      <mesh position={[-w/4 - 0.5, h/2, d/2]} receiveShadow castShadow>
        <boxGeometry args={[w/2 - 1, h, 0.5]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Right side of door */}
      <mesh position={[w/4 + 0.5, h/2, d/2]} receiveShadow castShadow>
        <boxGeometry args={[w/2 - 1, h, 0.5]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Top of door */}
      <mesh position={[0, h - 2, d/2]} receiveShadow castShadow>
        <boxGeometry args={[3, 4, 0.5]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Invisible Door trigger area */}
      <mesh 
        position={[0, 2.5, d/2]} 
        visible={false}
      >
        <boxGeometry args={[3, 5, 1]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Windows (on the front walls) */}
      <mesh position={[-2.5, 3, d/2 + 0.26]}>
        <boxGeometry args={[1.5, 3, 0.05]} />
        <meshStandardMaterial color="#88ccff" transparent opacity={0.4} roughness={0.1} />
      </mesh>
      <mesh position={[2.5, 3, d/2 + 0.26]}>
        <boxGeometry args={[1.5, 3, 0.05]} />
        <meshStandardMaterial color="#88ccff" transparent opacity={0.4} roughness={0.1} />
      </mesh>

      {/* Shop Sign */}
      <mesh position={[0, h - 1, d/2 + 0.3]} castShadow>
        <boxGeometry args={[6, 1.5, 0.2]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <Text
        position={[0, h - 1, d/2 + 0.45]}
        fontSize={0.8}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
    </group>
  );
};
