'use client';

import React from 'react';

interface NextButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

const NextButton: React.FC<NextButtonProps> = ({ onClick, disabled = false }) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className='flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all duration-200 hover:bg-blue-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-30 disabled:shadow-none'
      aria-label='Next slide'
    >
      <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 5l7 7-7 7' />
      </svg>
    </button>
  );
};

export default NextButton;
