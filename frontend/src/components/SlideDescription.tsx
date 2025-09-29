'use client';

import clsx from 'clsx';
import React from 'react';

interface SlideDescriptionProps {
  children: React.ReactNode;
  width?: string;
  margin?: string;
  opacity?: number;
}

const SlideDescription: React.FC<SlideDescriptionProps> = ({
  children,
  width = '',
  margin = 'mb-6',
  opacity = 80
}) => {
  return (
    <p
      className={clsx(`text-base md:text-xl opacity-${opacity} ${margin} leading-relaxed`, width)}>
      {children}
    </p>
  );
};

export default SlideDescription;
