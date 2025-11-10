'use client';

import React from 'react';

import CheckmarkList from './CheckmarkList';
import { RECAP_SLIDE_1 } from '@/contents/recap';

interface RecapSlide1Props {
  title?: string;
  description?: string;
  checkmarkItems?: string[];
  opacity?: number;
  delay?: number;
}

const RecapSlide1: React.FC<RecapSlide1Props> = ({
  opacity = 100,
  delay = 0.2,
}) => {
  const containerStyle = {
    opacity: opacity / 100,
    transform: `scale(${opacity === 100 ? 1 : 0.95})`,
    transitionDelay: `${delay}s`,
    transition: `opacity 0.8s ease-out, transform 0.8s ease-out`,
  };

  return (
    <div
      className='mx-auto max-h-full max-w-6xl overflow-y-auto p-6 md:p-12'
      style={containerStyle}
    >
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-4'>
          <div className='text-3xl tracking-[-0.56px] text-gray-900 md:text-4xl lg:text-5xl'>
            <p className='leading-[1.2]'>{RECAP_SLIDE_1.title}</p>
          </div>
          <div className='max-w-3xl text-lg tracking-[0.1px] text-gray-600 md:text-xl'>
            <p className='leading-[28px]'>{RECAP_SLIDE_1.description}</p>
          </div>
        </div>
        <CheckmarkList items={RECAP_SLIDE_1.checkmarkItems} opacity={100} delay={delay + 0.2} />
      </div>
    </div>
  );
};

export default RecapSlide1;
