'use client';

import React from 'react';

interface NoticeCardProps {
  children: React.ReactNode;
  background?: string;
  colSpan?: string;
  delay?: number;
  opacity?: number;
  translateY?: number;
}

const NoticeCard: React.FC<NoticeCardProps> = ({
  children,
  background,
  colSpan = 'col-span-1 sm:col-span-3',
  delay = 0.55,
  opacity = 0,
  translateY = 4,
}) => {
  return (
    <div
      className={`opacity-${opacity} translate-y-${translateY} ${colSpan} translate-y-0 opacity-100`}
      style={{
        transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
      }}
    >
      <div
        className={`h-full w-full ${background} relative overflow-hidden rounded-lg border border-transparent p-3`}
      >
        <div className='flex flex-col'>
          <div className='flex flex-1 flex-col justify-end'>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default NoticeCard;
