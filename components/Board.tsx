
import React from 'react';
import Block from './Block';
import { COLS, ROWS } from '../constants';

interface BoardProps {
  grid: (string | 0)[][];
}

const Board: React.FC<BoardProps> = ({ grid }) => {
  return (
    <div 
      className="grid gap-px p-1 bg-white/10 neon-border rounded-lg backdrop-blur-sm"
      style={{
        gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
        width: 'min(90vw, 320px)',
        height: 'min(180vw, 640px)',
      }}
    >
      {grid.flat().map((type, i) => (
        <Block key={i} type={type} />
      ))}
    </div>
  );
};

export default Board;
