'use client';

import React from 'react';

interface NavigationButtonsProps {
  onPrevious?: () => void;
  onNext?: () => void;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onPrevious,
  onNext,
  canGoPrevious = false,
  canGoNext = true,
}) => {
  return (
    <div className='fixed right-6 bottom-6 z-50 flex items-center gap-3'>
      <button
        disabled={!canGoPrevious}
        onClick={onPrevious}
        className='flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-slate-300 text-gray-600 shadow-lg transition-all duration-200 hover:bg-slate-400 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-30 disabled:shadow-none'
        aria-label='Previous slide'
      >
        <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 19l-7-7 7-7' />
        </svg>
      </button>

      <button
        disabled={!canGoNext}
        onClick={onNext}
        className='flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all duration-200 hover:bg-blue-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-30 disabled:shadow-none'
        aria-label='Next slide'
      >
        <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 5l7 7-7 7' />
        </svg>
      </button>
    </div>
  );
};

export default NavigationButtons;
