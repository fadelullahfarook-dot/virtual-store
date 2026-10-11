import React from 'react';

interface InteractionPromptProps {
  message: string;
}

export const InteractionPrompt: React.FC<InteractionPromptProps> = ({ message }) => {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-16 pointer-events-none">
      <div className="bg-black/70 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 shadow-lg backdrop-blur-sm">
        <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-bold">E</span>
        <span>{message}</span>
      </div>
    </div>
  );
};
