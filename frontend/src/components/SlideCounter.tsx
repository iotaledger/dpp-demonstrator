'use client';

import React from 'react';

interface SlideCounterProps {
  current?: number;
  total?: number;
}

const SlideCounter: React.FC<SlideCounterProps> = ({
  current = 1,
  total = 11
}) => {
  return (
    <div
      className="absolute bottom-5 left-6 bg-black/30 backdrop-blur-md text-white z-[80] rounded-full text-sm px-3 py-2 font-medium">
      {current} of {total}
    </div>
  );
};

export default SlideCounter;
