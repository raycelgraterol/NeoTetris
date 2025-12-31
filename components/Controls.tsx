
import React from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  ArrowDown, 
  RotateCw, 
  Pause, 
  Play,
  RotateCcw
} from 'lucide-react';

interface ControlsProps {
  onMove: (dir: number) => void;
  onRotate: () => void;
  onDrop: () => void;
  onPause: () => void;
  isPaused: boolean;
}

const Controls: React.FC<ControlsProps> = ({ onMove, onRotate, onDrop, onPause, isPaused }) => {
  return (
    <div className="grid grid-cols-3 gap-4 w-full max-w-[320px] mt-6 px-4 md:hidden">
      <div />
      <button 
        onClick={onRotate}
        className="flex items-center justify-center p-4 bg-purple-600/30 rounded-full neon-border active:scale-95 transition-transform"
      >
        <RotateCw className="text-white" size={32} />
      </button>
      <div />

      <button 
        onClick={() => onMove(-1)}
        className="flex items-center justify-center p-4 bg-cyan-600/30 rounded-full neon-border active:scale-95 transition-transform"
      >
        <ArrowLeft className="text-white" size={32} />
      </button>
      <button 
        onClick={onDrop}
        className="flex items-center justify-center p-4 bg-cyan-600/30 rounded-full neon-border active:scale-95 transition-transform"
      >
        <ArrowDown className="text-white" size={32} />
      </button>
      <button 
        onClick={() => onMove(1)}
        className="flex items-center justify-center p-4 bg-cyan-600/30 rounded-full neon-border active:scale-95 transition-transform"
      >
        <ArrowRight className="text-white" size={32} />
      </button>

      <div />
      <button 
        onClick={onPause}
        className="flex items-center justify-center p-4 bg-yellow-600/30 rounded-full neon-border active:scale-95 transition-transform"
      >
        {isPaused ? <Play className="text-white" size={32} /> : <Pause className="text-white" size={32} />}
      </button>
      <div />
    </div>
  );
};

export default Controls;
