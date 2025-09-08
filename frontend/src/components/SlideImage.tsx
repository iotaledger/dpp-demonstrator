import React from 'react';

interface SlideImageProps {
  src: string;
  alt: string;
  opacity?: number;
  scale?: number;
  delay?: number;
}

const SlideImage: React.FC<SlideImageProps> = ({
  src,
  alt,
  opacity = 0,
  scale = 95,
  delay = 0.15
}) => {
  return (
    <div className="flex justify-center md:justify-end order-2 md:order-1">
      <div className="relative">
        <div className="relative w-full max-w-md h-full max-h-[320px] aspect-[4/3] rounded-2xl overflow-hidden">
          <img
            style={{
              transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`
            }}
            loading="lazy"
            src={src}
            alt={alt}
            className={`w-full h-full object-contain p-6 opacity-${opacity} scale-${scale} opacity-100 scale-100`}
          />
        </div>
      </div>
    </div>
  );
};

export default SlideImage;