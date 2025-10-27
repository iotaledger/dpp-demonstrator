'use client';

import React from 'react';

interface PrevButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

const PrevButton: React.FC<PrevButtonProps> = ({
  onClick,
  disabled = true
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="w-12 h-12 bg-slate-300 hover:bg-slate-400 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-gray-600 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
      aria-label="Previous slide"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );
};

export default PrevButton;
