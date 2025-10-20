'use client';

import React from 'react';

interface ImageTextLayoutProps {
  children: React.ReactNode;
  gap?: string;
  pb?: string;
  maxWidth?: string;
}

const ImageTextLayout: React.FC<ImageTextLayoutProps> = ({
  children,
  gap = "gap-4 sm:gap-8 lg:gap-12",
  pb = "pb-0",
  maxWidth = "max-w-6xl",
}) => {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 ${gap} items-center self-center mx-auto ${maxWidth} ${pb}`}>
      {children}
    </div>
  );
};

export default ImageTextLayout;
