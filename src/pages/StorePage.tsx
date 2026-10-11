import React from 'react';
import { Canvas } from '@react-three/fiber';
import { StreetEnvironment } from '../3d/environments/StreetEnvironment';
import { useStore } from '../store/useStore';
import { InteractionPrompt } from '../components/InteractionPrompt';
import { ProductInfoPanel } from '../components/ProductInfoPanel';

export const StorePage: React.FC = () => {
  const { nearbyStore, nearbyProduct, isInsideStore, stores } = useStore();

  let promptMessage = '';
  if (!isInsideStore && nearbyStore) {
    const store = stores.find(s => s.id === nearbyStore);
    promptMessage = `Enter ${store?.name || 'Store'}`;
  } else if (isInsideStore && nearbyStore === 'exit') {
    promptMessage = 'Exit Store';
  } else if (nearbyProduct) {
    promptMessage = 'View Product';
  }
  return (
    <div className="w-full flex flex-col items-center gap-4 py-4 h-full">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Virtual Shopping Street
        </h2>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Click on the 3D view to enter first-person mode. Use WASD to move and mouse to look around.
        </p>
      </div>

      <div className="w-full max-w-5xl h-[600px] rounded-xl overflow-hidden shadow-2xl border border-gray-200 bg-sky-200 relative">
        {/* The id="webgl-container" will be targeted by PointerLockControls in Player.tsx */}
        <div id="webgl-container" className="w-full h-full cursor-pointer relative">
          <Canvas shadows camera={{ fov: 60 }}>
            <StreetEnvironment />
          </Canvas>
          
          {/* UI Overlays */}
          {promptMessage && <InteractionPrompt message={promptMessage} />}
          <ProductInfoPanel />
        </div>
        
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg text-sm font-medium text-gray-700 shadow-sm pointer-events-none z-10">
          WASD: Move | Mouse: Look | E: Interact
        </div>
      </div>
    </div>
  );
};
