import React from 'react';

export const Road: React.FC = () => {
  return (
    <group>
      {/* Main Street */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 200]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Center Line */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -100 + i * 10 + 5]} receiveShadow>
          <planeGeometry args={[0.2, 5]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}

      {/* Left Sidewalk */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-7, 0.1, 0]} receiveShadow>
        <planeGeometry args={[4, 200]} />
        <meshStandardMaterial color="#aaaaaa" />
      </mesh>

      {/* Right Sidewalk */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[7, 0.1, 0]} receiveShadow>
        <planeGeometry args={[4, 200]} />
        <meshStandardMaterial color="#aaaaaa" />
      </mesh>
    </group>
  );
};
