/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';

interface ProgressBarProps {
  progress?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress = 10 }) => {
  return (
    <div className='fixed top-0 left-0 z-50 h-2 w-full bg-black/20'>
      <div
        className='h-full bg-blue-500 transition-all duration-300 ease-out'
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;
