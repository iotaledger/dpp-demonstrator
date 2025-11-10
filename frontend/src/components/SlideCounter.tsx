'use client';

import React from 'react';
import { SLIDE_COUNTER } from '@/contents/common';

interface SlideCounterProps {
  current?: number;
  total?: number;
}

const SlideCounter: React.FC<SlideCounterProps> = ({ current = 1, total = 11 }) => {
  return (
    <div className='fixed bottom-6 left-6 z-[80] rounded-full bg-black/30 px-3 py-2 text-sm font-medium text-white backdrop-blur-md'>
      {SLIDE_COUNTER.content.template.replace('{current}', current.toString()).replace('{total}', total.toString())}
    </div>
  );
};

export default SlideCounter;
