import React from 'react';

interface InteractionPromptProps {
  message: string;
  onInteract?: () => void;
}

export const InteractionPrompt: React.FC<InteractionPromptProps> = ({ message, onInteract }) => {
  const handleClick = () => {
    if (onInteract) {
      onInteract();
    } else {
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyE' }));
    }
  };

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-16 z-30 pointer-events-auto">
      <button
        type="button"
        onClick={handleClick}
        className="bg-black/80 hover:bg-black/95 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 shadow-2xl backdrop-blur-sm cursor-pointer transition-all hover:scale-105 active:scale-95 border border-white/20"
      >
        <span className="bg-white/25 px-2 py-0.5 rounded text-xs font-bold border border-white/30">E</span>
        <span>{message}</span>
        <span className="text-[10px] text-gray-300 ml-1 opacity-80">(or Click)</span>
      </button>
    </div>
  );
};
