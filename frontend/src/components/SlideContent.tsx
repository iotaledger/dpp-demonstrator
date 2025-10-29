'use client';

import React from 'react';

import { clsx } from 'clsx';

import { useTransitionTrigger } from '@/hooks/useTransitionTrigger';

interface SlideContentProps {
  children: React.ReactNode;
  textAlign?: 'center' | 'left';
  opacity?: number;
  translateY?: number;
  translateX?: number;
  delay?: number;
}

const SlideContent: React.FC<SlideContentProps> = ({
  children,
  textAlign = 'left',
  opacity = 0,
  translateY = 4,
  translateX = 4,
  delay = 300,
}) => {
  const { isTriggered } = useTransitionTrigger(delay);
  const getTextAlignClass = () => {
    return textAlign === 'center' ? 'text-center' : 'text-center md:text-left';
  };

  const getTransformClass = () => {
    if (textAlign === 'center') {
      return `opacity-${opacity} translate-y-${translateY}`;
    }
    return `opacity-${opacity} translate-y-${translateY} md:translate-y-0 md:translate-x-${translateX}`;
  };

  const getActivedTransformClass = () => {
    if (textAlign === 'center') {
      return 'opacity-100 translate-y-0';
    }
    return 'opacity-100 translate-y-0 md:translate-x-0';
  };

  return (
    <div className={`${getTextAlignClass()} order-1 pt-0 sm:pr-6 md:order-2`}>
      <div
        style={{
          transition: `opacity 0.6s ease-out 0.25s, transform 0.6s ease-out 0.25s`,
        }}
        className={clsx(getTransformClass(), isTriggered && getActivedTransformClass())}
      >
        {children}
      </div>
    </div>
  );
};

export default SlideContent;
