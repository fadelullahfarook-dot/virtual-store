import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from '../../store/useStore';
import type { ProductConfig } from '../../types';
import { AframeRoad } from './AframeRoad';
import { AframeTree } from './AframeTree';
import { AframeStore } from './AframeStore';

export const AframeStreetEnvironment: React.FC = () => {
  const [aframeLoaded, setAframeLoaded] = useState(false);
  const sceneRef = useRef<any>(null);

  const {
    stores,
    currentStore,
    setCurrentStore,
    isInsideStore,
    setIsInsideStore,
    setNearbyStore,
    setNearbyProduct,
    setSelectedProduct
  } = useStore();

  const enterStore = useCallback((storeId: string) => {
    const store = stores.find(s => s.id === storeId);
    if (!store) return;

    setIsInsideStore(true);
    setCurrentStore(storeId);

    const cameraEl = document.getElementById('aframe-player-camera') as any;
    if (cameraEl) {
      const enterYaw = store.position[0] < 0 ? -Math.PI / 2 : Math.PI / 2;
      if (cameraEl.object3D) {
        cameraEl.object3D.position.set(store.position[0], 1.6, store.position[2]);
        cameraEl.object3D.rotation.y = enterYaw;
      } else {
        cameraEl.setAttribute('position', `${store.position[0]} 1.6 ${store.position[2]}`);
      }
      if (cameraEl.components && cameraEl.components['look-controls']) {
        cameraEl.components['look-controls'].yawObject.rotation.y = enterYaw;
        cameraEl.components['look-controls'].pitchObject.rotation.x = 0;
      }
    }
  }, [stores, setIsInsideStore, setCurrentStore]);

  const exitStore = useCallback(() => {
    const state = useStore.getState();
    const store = stores.find(s => s.id === state.currentStore);
    if (!store) return;

    setIsInsideStore(false);
    setCurrentStore(null);

    const cameraEl = document.getElementById('aframe-player-camera') as any;
    if (cameraEl) {
      const exitX = store.position[0] < 0 ? -6 : 6;
      const exitYaw = store.position[0] < 0 ? Math.PI / 2 : -Math.PI / 2;
      if (cameraEl.object3D) {
        cameraEl.object3D.position.set(exitX, 1.6, store.position[2]);
        cameraEl.object3D.rotation.y = exitYaw;
      } else {
        cameraEl.setAttribute('position', `${exitX} 1.6 ${store.position[2]}`);
      }
      if (cameraEl.components && cameraEl.components['look-controls']) {
        cameraEl.components['look-controls'].yawObject.rotation.y = exitYaw;
        cameraEl.components['look-controls'].pitchObject.rotation.x = 0;
      }
    }
  }, [stores, setIsInsideStore, setCurrentStore]);

  // Load A-Frame dynamically on client-side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('aframe')
        .then(() => {
          setAframeLoaded(true);
        })
        .catch(err => {
          console.error('Failed to load A-Frame:', err);
        });
    }
  }, []);

  // Proximity & Collision Loop (10 updates per second for optimal performance)
  useEffect(() => {
    if (!aframeLoaded) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyE') {
        const state = useStore.getState();
        if (!state.isInsideStore && state.nearbyStore) {
          enterStore(state.nearbyStore);
        } else if (state.isInsideStore && state.nearbyStore === 'exit') {
          exitStore();
        } else if (state.nearbyProduct) {
          const store = state.stores.find(s => s.id === state.currentStore);
          const product = store?.products.find(p => (p.id || p._id) === state.nearbyProduct);
          if (product) {
            setSelectedProduct(product);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const interval = setInterval(() => {
      const cameraEl = document.getElementById('aframe-player-camera') as any;
      if (!cameraEl) return;

      const pos = cameraEl.object3D?.position;
      if (!pos) return;

      const state = useStore.getState();
      const currentStores = state.stores;
      const inside = state.isInsideStore;
      const activeStoreId = state.currentStore;

      let foundNearbyStore: string | null = null;
      let foundNearbyProduct: string | null = null;

      if (!inside) {
        // Enforce street boundaries
        let clampedX = pos.x;
        let clampedZ = pos.z;
        if (clampedX < -10) clampedX = -10;
        if (clampedX > 10) clampedX = 10;
        if (clampedZ < -80) clampedZ = -80;
        if (clampedZ > 20) clampedZ = 20;

        if (clampedX !== pos.x || clampedZ !== pos.z) {
          pos.x = clampedX;
          pos.z = clampedZ;
        }

        // Distance check to store entrances
        for (const store of currentStores) {
          const dist = Math.hypot(pos.x - store.position[0], pos.z - store.position[2]);
          if (dist < 6.5) {
            foundNearbyStore = store.id;
            break;
          }
        }
      } else {
        // Player is inside a store
        const store = currentStores.find(s => s.id === activeStoreId);
        if (store) {
          // Enforce store boundaries (8x8 room: max offset 3.6 from center)
          const dx = pos.x - store.position[0];
          const dz = pos.z - store.position[2];

          let adjustedX = pos.x;
          let adjustedZ = pos.z;
          if (Math.abs(dx) > 3.6) adjustedX = store.position[0] + Math.sign(dx) * 3.6;
          if (Math.abs(dz) > 3.6) adjustedZ = store.position[2] + Math.sign(dz) * 3.6;

          if (adjustedX !== pos.x || adjustedZ !== pos.z) {
            pos.x = adjustedX;
            pos.z = adjustedZ;
          }

          // Check if near store exit doorway (toward the street entrance)
          const isNearExit = (store.position[0] < 0 && pos.x > store.position[0] + 1.2) ||
                             (store.position[0] > 0 && pos.x < store.position[0] - 1.2);

          if (isNearExit) {
            foundNearbyStore = 'exit';
          }

          // Proximity to products inside store
          for (const prod of store.products) {
            // Calculate world coordinates of product
            // Store orientation is either +90 or -90 deg around Y
            const rotY = store.rotation[1];
            const cos = Math.cos(rotY);
            const sin = Math.sin(rotY);
            const worldPx = store.position[0] + (prod.position[0] * cos + prod.position[2] * sin);
            const worldPz = store.position[2] + (-prod.position[0] * sin + prod.position[2] * cos);

            const dist = Math.hypot(pos.x - worldPx, pos.z - worldPz);
            if (dist < 2.5) {
              foundNearbyProduct = prod.id || prod._id || null;
              break;
            }
          }
        }
      }

      setNearbyStore(foundNearbyStore);
      setNearbyProduct(foundNearbyProduct);
    }, 100);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(interval);
    };
  }, [aframeLoaded, setNearbyStore, setNearbyProduct, setSelectedProduct, enterStore, exitStore]);

  const handleSelectProduct = (product: ProductConfig) => {
    setSelectedProduct(product);
  };

  if (!aframeLoaded) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mb-4"></div>
        <p className="text-lg font-medium">Loading Virtual 3D Shopping Street...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <a-scene 
        ref={sceneRef}
        embedded 
        vr-mode-ui="enabled: false"
        cursor="rayOrigin: mouse"
        raycaster="objects: .clickable"
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
      >
        {/* Sky */}
        <a-sky color="#87CEEB"></a-sky>

        {/* Ambient & Directional Lighting */}
        <a-light type="ambient" color="#ffffff" intensity="0.5"></a-light>
        <a-light 
          type="directional" 
          position="50 100 50" 
          intensity="1.3" 
          castShadow="true"
        ></a-light>

        {/* Road and Sidewalks */}
        <AframeRoad />

        {/* Trees lining the street */}
        {Array.from({ length: 6 }).map((_, i) => (
          <React.Fragment key={i}>
            <AframeTree position={[-8, 0, -10 - i * 15]} />
            <AframeTree position={[8, 0, -15 - i * 15]} />
          </React.Fragment>
        ))}

        {/* Stores along the street */}
        {stores.map((store) => (
          <AframeStore 
            key={store.id} 
            store={store} 
            onEnterStore={enterStore}
            onExitStore={exitStore}
            onSelectProduct={handleSelectProduct}
          />
        ))}

        {/* First-person Camera Rig with WASD controls and mouse-look */}
        <a-entity id="player-rig" position="0 0 0">
          <a-camera
            id="aframe-player-camera"
            position="0 1.6 5"
            wasd-controls="acceleration: 45"
            look-controls="pointerLockEnabled: false"
          >
            {/* Optional Reticle Cursor */}
            <a-cursor
              fuse="false"
              color="#ffffff"
              opacity="0.6"
              scale="0.8 0.8 0.8"
              raycaster="objects: .clickable; far: 15"
            ></a-cursor>
          </a-camera>
        </a-entity>
      </a-scene>

      {/* Quick Navigation Toolbar */}
      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-gray-200 z-30 flex flex-wrap gap-2 items-center text-xs">
        <span className="font-bold text-gray-700 mr-1">Quick Jump:</span>
        <button
          type="button"
          onClick={() => {
            setIsInsideStore(false);
            setCurrentStore(null);
            const cameraEl = document.getElementById('aframe-player-camera') as any;
            if (cameraEl) {
              if (cameraEl.object3D) {
                cameraEl.object3D.position.set(0, 1.6, 5);
              } else {
                cameraEl.setAttribute('position', '0 1.6 5');
              }
            }
          }}
          className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition cursor-pointer"
        >
          Street Entrance
        </button>
        {stores.map((store) => (
          <button
            key={store.id}
            type="button"
            onClick={() => enterStore(store.id)}
            className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
              currentStore === store.id && isInsideStore
                ? 'bg-indigo-600 text-white'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
            }`}
          >
            {store.name}
          </button>
        ))}
      </div>
    </div>
  );
};
