import React from 'react';

interface AframeTreeProps {
  position: [number, number, number];
}

export const AframeTree: React.FC<AframeTreeProps> = ({ position }) => {
  const [x, y, z] = position;
  return (
    <a-entity position={`${x} ${y} ${z}`} shadow="receive: true; cast: true">
      {/* Trunk */}
      <a-cylinder
        position="0 1.5 0"
        radius="0.4"
        height="3"
        color="#5c4033"
        material="roughness: 0.9"
        shadow="cast: true; receive: true"
      ></a-cylinder>

      {/* Lower Leaves */}
      <a-cone
        position="0 4 0"
        radius-bottom="2"
        radius-top="0.1"
        height="4"
        color="#228b22"
        material="roughness: 0.8"
        shadow="cast: true; receive: true"
      ></a-cone>

      {/* Upper Leaves */}
      <a-cone
        position="0 5.5 0"
        radius-bottom="1.5"
        radius-top="0.05"
        height="3"
        color="#2eb82e"
        material="roughness: 0.8"
        shadow="cast: true; receive: true"
      ></a-cone>
    </a-entity>
  );
};
