'use client';

import React from 'react';

interface TutorialCardProps {
  children: React.ReactNode;
}

const TutorialCard: React.FC<TutorialCardProps> = ({ children }) => {
  return (
    <div
      className="bg-slate-50 rounded-2xl border border-gray-300 flex flex-col relative"
      style={{
        height: '100%',
        overflow: 'hidden'
      }}
    >
      {children}
    </div>
  );
};

export default TutorialCard;
