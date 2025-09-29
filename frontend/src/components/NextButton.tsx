'use client';

import React from 'react';

interface NextButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

const NextButton: React.FC<NextButtonProps> = ({
  onClick,
  disabled = false
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="w-12 h-12 bg-blue-600 hover:bg-blue-700 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
      aria-label="Next slide"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
};

export default NextButton;
