'use client';

import React from 'react';

interface TutorialCardProps {
  children: React.ReactNode;
}

const TutorialCard: React.FC<TutorialCardProps> = ({ children }) => {
  return (
    <div
      className='relative flex flex-col rounded-2xl border border-gray-300 bg-slate-50'
      style={{
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
};

export default TutorialCard;
