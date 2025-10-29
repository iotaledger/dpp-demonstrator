'use client';

import clsx from 'clsx';
import React from 'react';

interface GridContainerProps {
  children: React.ReactNode;
  hasDrawer?: boolean;
}

const GridContainer: React.FC<GridContainerProps> = ({ children, hasDrawer = false }) => {
  return (
    <div className={clsx(['h-full', hasDrawer && 'max-lg:pb-[12rem]'])}>
      <div
        className={clsx(['h-full grid overflow-hidden transition-all duration-700 ease-out'])}
        style={{ gridTemplateColumns: '1fr 0px 0px' }}
      >
        {children}
      </div>
    </div>
  );
};

export default GridContainer;
