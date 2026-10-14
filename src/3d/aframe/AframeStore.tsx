import React from 'react';
import type { StoreConfig, ProductConfig } from '../../types';
import { AframeStoreExterior } from './AframeStoreExterior';
import { AframeStoreInterior } from './AframeStoreInterior';

interface AframeStoreProps {
  store: StoreConfig;
  onEnterStore?: (storeId: string) => void;
  onExitStore?: () => void;
  onSelectProduct?: (product: ProductConfig) => void;
}

export const AframeStore: React.FC<AframeStoreProps> = ({ 
  store,
  onEnterStore,
  onExitStore,
  onSelectProduct
}) => {
  const [px, py, pz] = store.position;
  const [rx, ry, rz] = store.rotation.map(r => (r * 180) / Math.PI);

  return (
    <a-entity 
      id={`store-container-${store.id}`}
      position={`${px} ${py} ${pz}`} 
      rotation={`${rx} ${ry} ${rz}`}
    >
      <AframeStoreExterior 
        store={store} 
        onEnterStore={onEnterStore} 
      />
      <AframeStoreInterior 
        store={store} 
        onSelectProduct={onSelectProduct}
        onExitStore={onExitStore}
      />
    </a-entity>
  );
};
