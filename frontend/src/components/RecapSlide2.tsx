'use client';

import React from 'react';

interface RecapSlide2Props {
  title?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  opacity?: number;
  delay?: number;
}

const RecapSlide2: React.FC<RecapSlide2Props> = ({
  title = 'Beyond Digital Product Passports',
  description = 'While this demo used a DPPs as its example, the principles and components you just explored are not tied to one sector or regulation. All showcased IOTA components are designed to be modular, open, and industry-agnostic.',
  imageSrc = '/assets/recap/recap_1.webp',
  imageAlt = 'Beyond Digital Product Passports',
  opacity = 100,
  delay = 0.3,
}) => {
  const containerStyle = {
    opacity: opacity / 100,
    transform: `translateX(${opacity === 100 ? 0 : 4}px)`,
    transitionDelay: `${delay}s`,
    transition: `opacity 0.8s ease-out, transform 0.8s ease-out`,
  };

  return (
    <div
      className='mx-auto max-h-full max-w-6xl overflow-y-auto p-6 md:p-12'
      style={containerStyle}
    >
      <div className='grid grid-cols-1 items-center gap-4 sm:grid-cols-2 sm:gap-8 lg:gap-12'>
        <div className='flex aspect-[4/3] h-full max-h-[320px] max-w-md justify-center rounded-3xl bg-gradient-to-br from-blue-50/70 to-blue-100/70 backdrop-blur-sm'>
          <img
            className='max-h-[250px] max-w-full lg:max-h-[350px]'
            src={imageSrc}
            alt={imageAlt}
          />
        </div>
        <div className='flex flex-col gap-6'>
          <div className='text-3xl font-medium tracking-[-0.56px] text-gray-900 md:text-4xl lg:text-5xl'>
            <p className='leading-[1.2]'>{title}</p>
          </div>
          <div className='text-lg tracking-[0.1px] text-gray-600'>
            <p className='leading-[1.6]'>{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecapSlide2;
