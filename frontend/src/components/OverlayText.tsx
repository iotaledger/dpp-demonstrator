'use client';

import React from 'react';

import clsx from 'clsx';

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
      className='absolute top-1/2 left-1/2 mx-auto w-full max-w-5xl -translate-x-1/2 -translate-y-1/2 transform px-6 py-6 text-center md:px-12 md:py-8'
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
              'font-light tracking-wide text-white/80',
              'pb-0.5 text-base',
              'md:pb-1.5 md:text-xl',
              'lg:pb-2.5 lg:text-2xl',
            ])}
          >
            {welcomeText}
          </div>
        )}
        {title && (
          <h1
            className={clsx([
              'leading-tight font-semibold text-white',
              'pb-2 text-2xl',
              'md:pb-3 md:text-3xl',
              'lg:pb-4 lg:text-4xl',
            ])}
          >
            {title}
          </h1>
        )}
        {description && (
          <p
            className={clsx([
              'mx-auto max-w-3xl leading-relaxed text-white/90',
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
