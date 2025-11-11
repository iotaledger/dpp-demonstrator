/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';

import { STEP_NAVIGATION } from '@/contents/common';

interface StepNavigationProps {
  canGoPrevious?: boolean;
  canGoNext?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  previousLabel?: string;
  nextLabel?: string;
  opacity?: number;
  delay?: number;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  canGoPrevious = true,
  canGoNext = true,
  onPrevious,
  onNext,
  previousLabel = STEP_NAVIGATION.content.previousLabelDefault,
  nextLabel = STEP_NAVIGATION.content.nextLabelDefault,
  opacity = 100,
  delay = 0,
}) => {
  return (
    <div
      className='flex items-center space-x-3'
      style={{
        opacity: opacity / 100,
        transition: `opacity ${delay}s ease-out`,
      }}
    >
      <button
        className={`rounded-full border border-gray-300 px-8 py-3 text-base font-medium text-gray-700 transition-colors ${
          canGoPrevious ? 'cursor-pointer hover:bg-gray-50' : 'cursor-not-allowed opacity-50'
        }`}
        onClick={onPrevious}
        disabled={!canGoPrevious}
      >
        {previousLabel}
      </button>

      <button
        className={`rounded-full px-8 py-3 text-base font-medium transition-colors ${
          canGoNext
            ? 'cursor-pointer bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-600'
            : 'cursor-not-allowed bg-gray-400 text-white opacity-50'
        }`}
        onClick={onNext}
        disabled={!canGoNext}
      >
        {nextLabel}
      </button>
    </div>
  );
};

export default StepNavigation;
