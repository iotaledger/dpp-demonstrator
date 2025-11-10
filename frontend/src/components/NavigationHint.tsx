'use client';

import React from 'react';

import { NAVIGATION_HINT } from '@/contents/common';

interface NavigationHintProps {
  text?: string;
  opacity?: number;
  delay?: number;
}

const NavigationHint: React.FC<NavigationHintProps> = ({ opacity = 0, delay = 0.5 }) => {
  return (
    <div
      className={`absolute bottom-6 left-1/2 z-40 -translate-x-1/2 transform opacity-${opacity} max-lg:hidden`}
      style={{
        transition: `opacity 0.6s ease-out ${delay}s`,
      }}
    >
      <div className='flex items-center gap-2 rounded-full bg-white/20 px-2 py-1 text-sm text-slate-400/90 backdrop-blur-sm'>
        <span>{NAVIGATION_HINT.content.text}</span>
      </div>
    </div>
  );
};

export default NavigationHint;
