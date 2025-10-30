'use client';

import React from 'react';
import CaretRightIcon from './icons/CaretRightIcon';

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
      <CaretRightIcon />
    </button>
  );
};

export default NextButton;
