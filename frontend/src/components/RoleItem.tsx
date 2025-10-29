'use client';

import React from 'react';

interface RoleItemProps {
  icon: string;
  title: string;
  description: string;
  delay?: number;
  opacity?: number;
  translateX?: number;
}

const RoleItem: React.FC<RoleItemProps> = ({
  icon,
  title,
  description,
  delay = 0.4,
  opacity = 0,
  translateX = 4,
}) => {
  return (
    <div
      className={`flex items-center gap-3 px-2 py-0.5 backdrop-blur-sm md:gap-4 md:py-2 opacity-${opacity} translate-x-${translateX} translate-x-0 opacity-100`}
      style={{
        transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
      }}
    >
      <div className='flex aspect-square h-6 w-6 items-center justify-center'>
        <img className='aspect-square h-8 w-8' src={icon} alt={title} />
      </div>
      <p className='text-left text-sm leading-relaxed opacity-90 md:text-sm'>{description}</p>
    </div>
  );
};

export default RoleItem;
