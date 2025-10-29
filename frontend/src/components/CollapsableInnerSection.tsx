'use client';

import React, { useState } from 'react';

interface CollapsibleInnerSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  showButton?: boolean;
  onExpandToggle?: () => void;
}

const CollapsibleInnerSection: React.FC<CollapsibleInnerSectionProps> = ({
  title,
  children,
  defaultExpanded = true,
  showButton = true,
  onExpandToggle: setExternalExpand,
}) => {
  const [isExpanded, setInternalExpand] = useState(defaultExpanded);

  const toggleExpanded = () => {
    if (typeof setExternalExpand === 'function') {
      setExternalExpand();
    } else {
      setInternalExpand(!isExpanded);
    }
  };

  const getIsExpanded = () => {
    if (typeof setExternalExpand === 'function') {
      return defaultExpanded;
    }

    return isExpanded;
  };

  return (
    <div className='space-y-4 rounded-lg border-1 border-gray-200 p-4'>
      <div className='flex items-center justify-between'>
        <h3 className='leading-none font-semibold tracking-tight'>{title}</h3>

        {showButton && (
          <button
            className='focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground inline-flex h-9 cursor-pointer items-center justify-center rounded-full px-3 transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:outline-none active:scale-98 disabled:pointer-events-none disabled:opacity-50'
            onClick={toggleExpanded}
            aria-expanded={getIsExpanded()}
          >
            <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d={getIsExpanded() ? 'm18 15-6-6-6 6' : 'm6 9 6 6 6-6'}
              />
            </svg>
          </button>
        )}
      </div>
      {getIsExpanded() && <>{children}</>}
    </div>
  );
};

export default CollapsibleInnerSection;
