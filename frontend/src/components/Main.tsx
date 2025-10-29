'use client';

import React from 'react';

import clsx from 'clsx';

interface MainProps {
  children: React.ReactNode;
  background?: string;
}

const Main: React.FC<MainProps> = ({ children, background }) => {
  return (
    <div
      className={clsx(['p-3 overflow-hidden', background && background])}
      style={{ height: '100dvh' }}
    >
      {children}
    </div>
  );
};

export default Main;
