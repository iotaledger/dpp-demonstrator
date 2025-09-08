import React from 'react';

interface SlideCounterProps {
  current?: number;
  total?: number;
}

const SlideCounter: React.FC<SlideCounterProps> = ({ 
  current = 1, 
  total = 10 
}) => {
  return (
    <div className="fixed top-4 right-4 z-50 bg-black/30 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
      {current} of {total}
    </div>
  );
};

export default SlideCounter;