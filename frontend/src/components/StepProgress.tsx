'use client';

import React from 'react';

interface StepProgressProps {
  currentStep?: number;
  totalSteps?: number;
  progressPercentage?: number;
  opacity?: number;
  delay?: number;
}

const StepProgress: React.FC<StepProgressProps> = ({
  currentStep = 8,
  totalSteps = 13,
  progressPercentage = 61.5385,
  opacity = 100,
  delay = 0,
}) => {
  return (
    <div
      className='flex shrink-[1] items-center gap-3'
      style={{
        opacity: opacity / 100,
        transition: `opacity ${delay}s ease-out`,
      }}
    >
      <span className='text-sm font-medium text-gray-900'>
        {currentStep}
        <span className='min-[360px]:hidden'>/{totalSteps}</span>
        <span className='max-[360px]:hidden'>
          {' of '}
          {totalSteps}
        </span>
      </span>

      <div className='h-1 w-16 overflow-hidden rounded-full bg-gray-200 max-[380px]:hidden'>
        <div
          className='h-full bg-blue-500 transition-all duration-300 ease-out'
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default StepProgress;
