import React from 'react';

interface ImageTextLayoutProps {
  children: React.ReactNode;
  gap?: string;
  imageOrder?: number;
  textOrder?: number;
}

const ImageTextLayout: React.FC<ImageTextLayoutProps> = ({
  children,
  gap = "gap-2 md:gap-16",
  imageOrder = 2,
  textOrder = 1
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 ${gap} items-center self-center`}>
      {children}
    </div>
  );
};

export default ImageTextLayout;