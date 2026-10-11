import React, { useState } from 'react';
import { Text } from '@react-three/drei';

interface ShopBuildingProps {
  position: [number, number, number];
  color: string;
  name: string;
  rotation?: [number, number, number];
  onClick?: () => void;
}

export const ShopBuilding: React.FC<ShopBuildingProps> = ({ 
  position, 
  color, 
  name, 
  rotation = [0, 0, 0],
  onClick
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position} rotation={rotation}>
      {/* Main Building Block */}
      <mesh 
        castShadow 
        receiveShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        <boxGeometry args={[8, 10, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Door */}
      <mesh position={[0, -2.5, 4.01]} receiveShadow>
        <boxGeometry args={[3, 5, 0.1]} />
        <meshStandardMaterial color={hovered ? "#ffddaa" : "#885522"} />
      </mesh>

      {/* Windows */}
      <mesh position={[-2, 1, 4.01]}>
        <boxGeometry args={[1.5, 2, 0.1]} />
        <meshStandardMaterial color="#88ccff" transparent opacity={0.6} />
      </mesh>
      <mesh position={[2, 1, 4.01]}>
        <boxGeometry args={[1.5, 2, 0.1]} />
        <meshStandardMaterial color="#88ccff" transparent opacity={0.6} />
      </mesh>

      {/* Shop Sign */}
      <mesh position={[0, 4, 4.1]}>
        <boxGeometry args={[6, 1.5, 0.2]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <Text
        position={[0, 4, 4.25]}
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
