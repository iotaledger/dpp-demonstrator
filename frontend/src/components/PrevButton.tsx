'use client';

import React from 'react';
import CaretLeftIcon from './icons/CaretLeftIcon';

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
      <CaretLeftIcon />
    </button>
  );
};

export default PrevButton;
