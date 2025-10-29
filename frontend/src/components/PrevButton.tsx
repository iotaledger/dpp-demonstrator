'use client';

import React from 'react';

interface PrevButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

const PrevButton: React.FC<PrevButtonProps> = ({ onClick, disabled = true }) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className='flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-slate-300 text-gray-600 shadow-lg transition-all duration-200 hover:bg-slate-400 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-30 disabled:shadow-none'
      aria-label='Previous slide'
    >
      <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 19l-7-7 7-7' />
      </svg>
    </button>
  );
};

export default PrevButton;
