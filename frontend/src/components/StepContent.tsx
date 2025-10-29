'use client';

import React from 'react';

interface StepContentProps {
  imageSrc?: string;
  imageAlt?: string;
  stepType?: string;
  stepTitle?: string;
  stepDescription?: string;
  opacity?: number;
  delay?: number;
}

const StepContent: React.FC<StepContentProps> = ({
  imageSrc = '/assets/steps/step_8.webp',
  imageAlt = 'Step Image',
  stepTitle = 'Step Title',
  stepDescription = 'Step description content goes here.',
  opacity = 100,
  delay = 0,
}) => {
  return (
    <div
      className='flex-1 overflow-y-auto p-6'
      style={{
        opacity: opacity / 100,
        transition: `opacity ${delay}s ease-out`,
      }}
    >
      <div>
        <div className='mb-4 flex aspect-video items-center justify-center overflow-clip rounded-lg border border-gray-200 bg-white'>
          <img
            className='max-h-full max-w-full object-contain transition-opacity duration-300'
            src={imageSrc}
            alt={imageAlt}
          />
        </div>

        <h3 className='pb-3 text-lg font-semibold text-gray-900'>{stepTitle}</h3>

        <div className='prose prose-sm leading-relaxed text-gray-600'>
          <div dangerouslySetInnerHTML={{ __html: stepDescription }} />
        </div>
      </div>
    </div>
  );
};

export default StepContent;
