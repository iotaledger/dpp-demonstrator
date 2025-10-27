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
  delay = 0
}) => {
  return (
    <div
      className="flex items-center gap-3 shrink-[1]"
      style={{
        opacity: opacity / 100,
        transition: `opacity ${delay}s ease-out`
      }}
    >
      <span className="text-sm font-medium text-gray-900">
        {currentStep}
        <span className='min-[360px]:hidden'>
          /{totalSteps}
        </span>
        <span className='max-[360px]:hidden'>
          {" of "}{totalSteps}
        </span>
      </span>

      <div className="max-[380px]:hidden w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default StepProgress;
