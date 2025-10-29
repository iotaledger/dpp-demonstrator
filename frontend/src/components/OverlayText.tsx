'use client';

import clsx from 'clsx';
import React from 'react';

interface OverlayTextProps {
  welcomeText?: string;
  title?: string;
  description?: string | React.ReactNode;
  opacity?: number;
  translateY?: number;
}

const OverlayText: React.FC<OverlayTextProps> = ({
  welcomeText,
  title,
  description,
  opacity = 0,
  translateY = 4,
}) => {
  return (
    <div
      className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl mx-auto text-center px-6 md:px-12 py-6 md:py-8'
      style={{ zIndex: 100 }}
    >
      <div
        className={`opacity-${opacity} translate-y-${translateY}`}
        style={{
          transition: 'opacity 0.6s ease-out 0.3s, transform 0.6s ease-out 0.3s',
        }}
      >
        {welcomeText && (
          <div
            className={clsx([
              'text-white/80 tracking-wide font-light',
              'text-base pb-0.5',
              'md:text-xl md:pb-1.5',
              'lg:text-2xl lg:pb-2.5',
            ])}
          >
            {welcomeText}
          </div>
        )}
        {title && (
          <h1
            className={clsx([
              'font-semibold leading-tight text-white',
              'text-2xl pb-2',
              'md:text-3xl md:pb-3',
              'lg:text-4xl lg:pb-4',
            ])}
          >
            {title}
          </h1>
        )}
        {description && (
          <p
            className={clsx([
              'text-white/90 leading-relaxed max-w-3xl mx-auto',
              'text-base',
              'md:text-xl',
              'lg:text-2xl',
            ])}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default OverlayText;
