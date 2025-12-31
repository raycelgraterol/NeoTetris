
import React from 'react';

interface BlockProps {
  type: string | 0;
}

const Block: React.FC<BlockProps> = ({ type }) => {
  if (type === 0) return <div className="w-full h-full bg-black/40 border border-white/5" />;

  const colorClass = `block-${type}`;
  return (
    <div className={`w-full h-full border border-white/20 transition-all duration-200 ${colorClass}`} />
  );
};

export default React.memo(Block);
