import { useEffect, useState } from 'react';

type KeyMap = {
  KeyW: boolean;
  KeyA: boolean;
  KeyS: boolean;
  KeyD: boolean;
  ArrowUp: boolean;
  ArrowLeft: boolean;
  ArrowDown: boolean;
  ArrowRight: boolean;
  KeyE: boolean;
};

export const useKeyboard = () => {
  const [keys, setKeys] = useState<KeyMap>({
    KeyW: false,
    KeyA: false,
    KeyS: false,
    KeyD: false,
    ArrowUp: false,
    ArrowLeft: false,
    ArrowDown: false,
    ArrowRight: false,
    KeyE: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (keys.hasOwnProperty(e.code)) {
        setKeys((prev) => ({ ...prev, [e.code]: true }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (keys.hasOwnProperty(e.code)) {
        setKeys((prev) => ({ ...prev, [e.code]: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [keys]);

  return keys;
};
