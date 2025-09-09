import React from 'react';

interface ImageTextLayoutProps {
  children: React.ReactNode;
  gap?: string;
  imageOrder?: number;
  textOrder?: number;
}

const ImageTextLayout: React.FC<ImageTextLayoutProps> = ({
  children,
  gap = "gap-4 sm:gap-8 lg:gap-12",
  imageOrder = 2,
  textOrder = 1
}) => {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 ${gap} items-center self-center mx-auto max-w-6xl py-6 sm:py-0`}>
      {children}
    </div>
  );
};

export default ImageTextLayout;
