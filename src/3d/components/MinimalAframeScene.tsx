import React, { useEffect, useState } from 'react';

export const MinimalAframeScene: React.FC = () => {
  const [aframeReady, setAframeReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('aframe')
        .then(() => {
          setAframeReady(true);
        })
        .catch((err) => {
          console.error('Failed to load A-Frame:', err);
        });
    }
  }, []);

  return (
    <div className="w-full flex flex-col items-center gap-4 py-4 h-full">
      <div className="text-center space-y-2">
        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full uppercase tracking-wider">
          Phase 2 Integration
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
          A-Frame Minimal 3D Scene
        </h2>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Testing A-Frame rendering, custom primitives, lighting, and camera controls inside React + Vite.
        </p>
      </div>

      <div 
        id="aframe-minimal-container" 
        className="w-full max-w-5xl h-[600px] rounded-xl overflow-hidden shadow-2xl border border-gray-200 bg-sky-100 relative"
      >
        {!aframeReady ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mb-4"></div>
            <p className="text-lg font-medium">Initializing A-Frame Engine...</p>
          </div>
        ) : (
          <a-scene 
            embedded 
            vr-mode-ui="enabled: false"
            style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
          >
            {/* Ambient and Directional Lighting */}
            <a-light type="ambient" color="#ffffff" intensity="0.6"></a-light>
            <a-light type="directional" position="2 4 3" intensity="0.8" castShadow="true"></a-light>

            {/* Test 3D Primitives */}
            <a-box 
              position="-1.5 0.75 -3.5" 
              rotation="0 45 0" 
              width="1" 
              height="1.5" 
              depth="1" 
              color="#4361EE" 
              shadow
            ></a-box>
            <a-sphere 
              position="0 1.25 -4.5" 
              radius="1" 
              color="#F72585" 
              shadow
            ></a-sphere>
            <a-cylinder 
              position="1.5 0.75 -3.5" 
              radius="0.5" 
              height="1.5" 
              color="#4CC9F0" 
              shadow
            ></a-cylinder>

            {/* Ground Plane */}
            <a-plane 
              position="0 0 -4" 
              rotation="-90 0 0" 
              width="12" 
              height="12" 
              color="#2B2D42" 
              shadow
            ></a-plane>

            {/* Sky */}
            <a-sky color="#87CEEB"></a-sky>

            {/* 3D Label */}
            <a-text 
              value="A-Frame Minimal Scene Active" 
              position="0 2.8 -4" 
              align="center" 
              color="#111827" 
              width="6"
            ></a-text>

            {/* Camera with WASD and Mouse Look */}
            <a-entity 
              camera 
              look-controls="pointerLockEnabled: false" 
              wasd-controls="acceleration: 25" 
              position="0 1.6 0"
            ></a-entity>
          </a-scene>
        )}

        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg text-sm font-medium text-gray-700 shadow-sm pointer-events-none z-10">
          WASD: Move | Drag/Mouse: Look Around | A-Frame v1.7.x
        </div>
      </div>
    </div>
  );
};
