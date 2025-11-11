/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';

import clsx from 'clsx';

interface TutorialScrollContainerProps {
  children: React.ReactNode;
  isRecap?: boolean;
}

const TutorialScrollContainer: React.FC<TutorialScrollContainerProps> = ({
  children,
  isRecap = false,
}) => {
  return (
    <div
      id='tutorial-scroll-container'
      className={clsx([
        'relative flex-1 overflow-x-hidden overflow-y-auto',
        isRecap && 'bg-slate-100',
      ])}
      style={{
        touchAction: 'pan-y',
        WebkitOverflowScrolling: 'touch',
        minHeight: 0,
        position: 'relative',
        zIndex: 1,
      }}
    >
      {children}
    </div>
  );
};

export default TutorialScrollContainer;
