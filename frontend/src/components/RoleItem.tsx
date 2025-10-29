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
      className={`flex items-center gap-3 md:gap-4 backdrop-blur-sm px-2 py-0.5 md:py-2 opacity-${opacity} translate-x-${translateX} opacity-100 translate-x-0`}
      style={{
        transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
      }}
    >
      <div className='w-6 h-6 aspect-square flex items-center justify-center'>
        <img className='w-8 h-8 aspect-square' src={icon} alt={title} />
      </div>
      <p className='text-sm md:text-sm text-left opacity-90 leading-relaxed'>{description}</p>
    </div>
  );
};

export default RoleItem;
