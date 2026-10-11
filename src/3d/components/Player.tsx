import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import { Vector3, Euler } from 'three';
import { useKeyboard } from '../../hooks/useKeyboard';
import { useStore } from '../../store/useStore';

const WALK_SPEED = 5;

export const Player: React.FC = () => {
  const { camera } = useThree();
  const keys = useKeyboard();
  const controlsRef = useRef<any>(null);
  
  const { 
    isInsideStore, setIsInsideStore,
    currentStore, setCurrentStore,
    setNearbyStore, setNearbyProduct,
    setSelectedProduct, stores
  } = useStore();

  const [lastE, setLastE] = useState(false);

  useEffect(() => {
    camera.position.set(0, 1.6, 5);
  }, [camera]);

  useFrame((_, delta) => {
    if (!controlsRef.current || !controlsRef.current.isLocked) return;

    const { KeyW, KeyA, KeyS, KeyD, ArrowUp, ArrowLeft, ArrowDown, ArrowRight, KeyE } = keys;

    // Movement
    const direction = new Vector3();
    const right = new Vector3();
    const velocity = new Vector3();

    camera.getWorldDirection(direction);
    direction.y = 0;
    direction.normalize();

    right.crossVectors(camera.up, direction).normalize();

    if (KeyW || ArrowUp) velocity.add(direction);
    if (KeyS || ArrowDown) velocity.sub(direction);
    if (KeyA || ArrowLeft) velocity.add(right);
    if (KeyD || ArrowRight) velocity.sub(right);

    if (velocity.lengthSq() > 0) {
      velocity.normalize().multiplyScalar(WALK_SPEED * delta);
      
      const nextPos = camera.position.clone().add(velocity);
      
      // Simple collision checks
      let canMove = true;
      
      if (isInsideStore && currentStore) {
        const store = stores.find(s => s.id === currentStore);
        if (store) {
          // Inside store bounds (simple box around store center)
          const dx = Math.abs(nextPos.x - store.position[0]);
          const dz = Math.abs(nextPos.z - store.position[2]);
          if (dx > 3.5 || dz > 3.5) {
            canMove = false; // hit wall
          }
        }
      } else {
        // On street bounds
        if (nextPos.x < -10 || nextPos.x > 10) canMove = false; // hit buildings
        if (nextPos.z > 20 || nextPos.z < -80) canMove = false; // street ends
      }

      if (canMove) {
        camera.position.copy(nextPos);
      }
    }

    // Interaction checks
    let foundNearbyStore = null;
    let foundNearbyProduct = null;

    if (!isInsideStore) {
      // Check distance to store entrances
      for (const store of stores) {
        const dist = Math.hypot(camera.position.x - store.position[0], camera.position.z - store.position[2]);
        if (dist < 6) { // near entrance
          foundNearbyStore = store.id;
          if (KeyE && !lastE) {
            // Enter store
            setIsInsideStore(true);
            setCurrentStore(store.id);
            // Teleport inside
            camera.position.set(store.position[0], 1.6, store.position[2]);
          }
          break;
        }
      }
    } else {
      // Inside a store
      const store = stores.find(s => s.id === currentStore);
      if (store) {
        // Check exit distance (store center)
        const distToCenter = Math.hypot(camera.position.x - store.position[0], camera.position.z - store.position[2]);
        // Let's say exit is towards the door. Since store is rotated, just near the door area is fine, or just any 'exit' prompt
        if (distToCenter > 2) { 
          // Let's say if you're not in the dead center, maybe near door? 
          // Simplified: near the original street entrance position but from inside
        }
        
        // Actually, let's just make the center of the store the 'exit' area for simplicity, or edge
        // Since store is 8x8, dx>2 or dz>2 might be near walls.
        // We will just use the edge nearest to the street as exit.
        const isNearExit = (store.position[0] < 0 && camera.position.x > store.position[0] + 1) ||
                           (store.position[0] > 0 && camera.position.x < store.position[0] - 1);
                           
        if (isNearExit) {
          foundNearbyStore = 'exit';
          if (KeyE && !lastE) {
            // Exit store
            setIsInsideStore(false);
            setCurrentStore(null);
            // Teleport to street outside the store
            const exitX = store.position[0] < 0 ? -6 : 6;
            camera.position.set(exitX, 1.6, store.position[2]);
            // Make camera face the street
            camera.rotation.y = store.position[0] < 0 ? Math.PI / 2 : -Math.PI / 2;
          }
        }

        // Check distance to products
        for (const prod of store.products) {
          // Transform local product position to world position
          // Store rotation is typically [0, +/-PI/2, 0]
          // Let's do simple math or just use Three's Vector3
          const localPos = new Vector3(prod.position[0], prod.position[1], prod.position[2]);
          const euler = new Euler(store.rotation[0], store.rotation[1], store.rotation[2], 'XYZ');
          localPos.applyEuler(euler);
          const worldPos = new Vector3(store.position[0], store.position[1], store.position[2]).add(localPos);

          const dist = Math.hypot(camera.position.x - worldPos.x, camera.position.z - worldPos.z);
          if (dist < 2.5) {
            foundNearbyProduct = prod.id;
            if (KeyE && !lastE) {
              setSelectedProduct(prod);
              // When UI is open, maybe unlock pointer? (Requires pointer unlock logic, we'll keep it simple for now)
              if (document.pointerLockElement) {
                document.exitPointerLock();
              }
            }
            break;
          }
        }
      }
    }

    setNearbyStore(foundNearbyStore || null);
    setNearbyProduct(foundNearbyProduct || null);
    setLastE(KeyE);
  });

  return (
    <PointerLockControls 
      ref={controlsRef} 
      selector="#webgl-container" 
    />
  );
};
