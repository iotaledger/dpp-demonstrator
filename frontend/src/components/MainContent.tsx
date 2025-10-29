'use client';

import React from 'react';

interface MainContentProps {
  children: React.ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return (
    <main className='overflow-hidden transition-all duration-700 ease-out'>
      <div className='h-full transition-all duration-700 ease-out'>
        <div className='h-full'>
          <div className='h-full'>{children}</div>
        </div>
      </div>
    </main>
  );
};

export default MainContent;
