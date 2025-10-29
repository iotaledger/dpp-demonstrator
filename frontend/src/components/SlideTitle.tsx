'use client';

import React from 'react';

interface SlideTitleProps {
  children: React.ReactNode;
  size?: 'large' | 'medium';
  margin?: string;
}

const SlideTitle: React.FC<SlideTitleProps> = ({ children, size = 'large', margin = 'mb-6' }) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'medium':
        return 'text-xl md:text-2xl lg:text-3xl';
      case 'large':
      default:
        return 'text-2xl md:text-3xl lg:text-4xl';
    }
  };

  return <h2 className={`${getSizeClasses()} ${margin} font-medium leading-tight`}>{children}</h2>;
};

export default SlideTitle;
