/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';

import clsx from 'clsx';

interface LoadingBarProps {
  progress: number;
  loadingText: string;
}

export const LoadingBar: React.FC<LoadingBarProps> = ({ progress, loadingText }) => {
  return (
    <div className={clsx('space-y-2', 'animate-[slideInUp_0.3s_ease-out_forwards]')}>
      <div className='flex justify-between text-sm text-gray-600'>
        <span className='animate-pulse'>{loadingText}</span>
        <span>{progress}</span>
      </div>
      <div className='h-4 w-full overflow-hidden rounded-full bg-gray-200'>
        <div
          className='h-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm transition-all duration-75 ease-out'
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};
