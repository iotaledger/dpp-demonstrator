'use client';

import clsx from 'clsx';
import React from 'react';

interface TutorialScrollContainerProps {
  children: React.ReactNode;
  isRecap?: boolean;
}

const TutorialScrollContainer: React.FC<TutorialScrollContainerProps> = ({ children, isRecap = false }) => {
  return (
    <div
      id="tutorial-scroll-container"
      className={clsx(["flex-1 overflow-y-auto overflow-x-hidden relative", isRecap && "bg-slate-100"])}
      style={{
        touchAction: 'pan-y',
        WebkitOverflowScrolling: 'touch',
        minHeight: 0,
        position: 'relative',
        zIndex: 1
      }}
    >
      {children}
    </div>
  );
};

export default TutorialScrollContainer;
