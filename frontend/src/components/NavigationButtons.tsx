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
    <div className='fixed bottom-6 right-6 z-50 flex items-center gap-3'>
      <button
        disabled={!canGoPrevious}
        onClick={onPrevious}
        className='w-12 h-12 bg-slate-300 hover:bg-slate-400 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-gray-600 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none'
        aria-label='Previous slide'
      >
        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 19l-7-7 7-7' />
        </svg>
      </button>

      <button
        disabled={!canGoNext}
        onClick={onNext}
        className='w-12 h-12 bg-blue-600 hover:bg-blue-700 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none'
        aria-label='Next slide'
      >
        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 5l7 7-7 7' />
        </svg>
      </button>
    </div>
  );
};

export default NavigationButtons;
