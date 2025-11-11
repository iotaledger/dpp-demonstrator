/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';

import CircularCheckIcon from './icons/CircularCheckIcon';

interface CheckmarkListProps {
  items: string[];
  opacity?: number;
  delay?: number;
}

const CheckmarkList: React.FC<CheckmarkListProps> = ({ items, opacity = 100, delay = 0 }) => {
  const containerStyle = {
    opacity: opacity / 100,
    transitionDelay: `${delay}s`,
    transition: `opacity 0.7s ease-out`,
  };

  return (
    <div className='grid grid-cols-1 gap-4 py-4 md:grid-cols-2' style={containerStyle}>
      {items.map((item, index) => (
        <div
          key={index}
          className='flex translate-y-0 translate-y-4 flex-row items-center gap-3 opacity-0 opacity-100 transition-all duration-700 ease-out'
          style={{ transitionDelay: `${delay + 0.1 * index}s` }}
        >
          <div className='relative size-6 shrink-0'>
            <CircularCheckIcon />
          </div>
          <div className='text-base font-normal tracking-[-0.16px] text-gray-900 md:text-lg'>
            <p className='leading-[1.6]'>{item}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CheckmarkList;
