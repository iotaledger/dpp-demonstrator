'use client';

import { useTransitionTrigger } from '@/hooks/useTransitionTrigger';
import clsx from 'clsx';
import React from 'react';

interface SlideImageProps {
  src: string;
  alt: string;
  width?: string;
  height?: string;
  opacity?: number;
  scale?: number;
  delay?: number;
}

const SlideImage: React.FC<SlideImageProps> = ({
  src,
  alt,
  width = 'w-full max-w-md',
  height = 'h-full max-h-[320px]',
  opacity = 0,
  scale = 95,
  delay = 250,
}) => {
  const { isTriggered } = useTransitionTrigger(delay);
  return (
    <div
      className="flex justify-center md:justify-end order-2 md:order-1">
      <div className="relative">
        <div
          className={`relative ${width} ${height} aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200`}
        >
          <img
            style={{
              transition: `opacity 0.6s ease-out 0.15s, transform 0.6s ease-out 0.15s`
            }}
            src={src}
            alt={alt}
            className={clsx(`w-full h-full object-contain p-6 opacity-${opacity} scale-${scale}`, isTriggered && 'opacity-100 scale-100')}
          />
        </div>
      </div>
    </div>
  );
};

export default SlideImage;
