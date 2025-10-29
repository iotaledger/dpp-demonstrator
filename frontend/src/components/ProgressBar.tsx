'use client';

import React from 'react';

interface ProgressBarProps {
  progress?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress = 10 }) => {
  return (
    <div className='fixed top-0 left-0 w-full h-2 bg-black/20 z-50'>
      <div
        className='h-full bg-blue-500 transition-all duration-300 ease-out'
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;
