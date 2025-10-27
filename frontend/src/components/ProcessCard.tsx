'use client';

import React from 'react';

interface ProcessCardProps {
  icon: string;
  title: string;
  description?: string;
}

const ProcessCard: React.FC<ProcessCardProps> = ({
  icon,
  title,
  description = '',
}) => {
  return (
    <>
      <div className={`bg-slate-100/50 border border-slate-200/80 rounded-2xl w-full h-full flex flex-col p-4`}>
        <div className="w-8 h-8 md:w-10 md:h-10 mb-4">
          <img className="w-full h-full object-contain" src={icon} alt={title} />
        </div>
        <div className="flex-1">
          <h4 className="text-sm md:text-base font-medium text-gray-900 mb-1">{title}</h4>
          <p className="text-xs md:text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </>
  );
};

export default ProcessCard;
