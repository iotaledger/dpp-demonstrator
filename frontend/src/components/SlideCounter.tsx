'use client';

import React from 'react';

interface SlideCounterProps {
  current?: number;
  total?: number;
}

const SlideCounter: React.FC<SlideCounterProps> = ({ current = 1, total = 11 }) => {
  return (
    <div className='fixed bottom-6 left-6 z-[80] rounded-full bg-black/30 px-3 py-2 text-sm font-medium text-white backdrop-blur-md'>
      {current} of {total}
    </div>
  );
};

export default SlideCounter;
