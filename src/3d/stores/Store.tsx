import React from 'react';
import type { StoreConfig } from '../../types';
import { StoreExterior } from './StoreExterior';
import { StoreInterior } from './StoreInterior';

interface StoreProps {
  store: StoreConfig;
}

export const Store: React.FC<StoreProps> = ({ store }) => {
  return (
    <group position={store.position} rotation={store.rotation}>
      <StoreExterior store={store} />
      <StoreInterior store={store} />
    </group>
  );
};
