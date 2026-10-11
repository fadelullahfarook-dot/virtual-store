import React from 'react';
import { Sky } from '@react-three/drei';
import { Player } from '../components/Player';
import { Road } from './Road';
import { Store } from '../stores/Store';
import { Tree } from './Tree';
import { useStore } from '../../store/useStore';

export const StreetEnvironment: React.FC = () => {
  const stores = useStore(state => state.stores);

  return (
    <>
      <Sky distance={450000} sunPosition={[100, 20, 100]} inclination={0} azimuth={0.25} />
      
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        castShadow 
        position={[50, 100, 50]} 
        intensity={1.5} 
        shadow-mapSize={[2048, 2048]}
      >
        <orthographicCamera attach="shadow-camera" args={[-100, 100, 100, -100]} />
      </directionalLight>
      
      {/* Environment */}
      <Road />
      <Player />

      {/* Stores */}
      {stores.map((store) => (
        <Store key={store.id} store={store} />
      ))}

      {/* Trees lining the street */}
      {Array.from({ length: 6 }).map((_, i) => (
        <React.Fragment key={i}>
          <Tree position={[-8, 0, -10 - i * 15]} />
          <Tree position={[8, 0, -15 - i * 15]} />
        </React.Fragment>
      ))}
    </>
  );
};
