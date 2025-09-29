'use client';

import React from 'react';

interface CheckmarkListProps {
  items: string[];
  opacity?: number;
  delay?: number;
}

const CheckmarkList: React.FC<CheckmarkListProps> = ({
  items,
  opacity = 100,
  delay = 0
}) => {
  const containerStyle = {
    opacity: opacity / 100,
    transitionDelay: `${delay}s`,
    transition: `opacity 0.7s ease-out`
  };

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4"
      style={containerStyle}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className="flex flex-row gap-3 items-center opacity-0 translate-y-4 transition-all duration-700 ease-out opacity-100 translate-y-0"
          style={{ transitionDelay: `${delay + 0.1 * index}s` }}
        >
          <div className="relative shrink-0 size-6">
            <svg
              className="block size-full text-blue-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
              />
            </svg>
          </div>
          <div className="font-normal text-gray-900 text-base md:text-lg tracking-[-0.16px]">
            <p className="leading-[1.6]">{item}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CheckmarkList;
