'use client';

import React from 'react';

interface SlideImageProps {
  src: string;
  alt: string;
}

const SlideImage: React.FC<SlideImageProps> = ({
  src,
  alt,
}) => {
  return (
    <div className="flex justify-center md:justify-end order-2 md:order-1">
      <div className="w-full max-w-md h-full max-h-[320px] rounded-3xl overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200">
        <img
          src={src}
          alt={alt}
          className={"w-full h-full aspect-[4/3] object-contain p-6"}
        />
      </div>
    </div>
  );
};

export default SlideImage;
