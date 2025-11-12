/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';

interface ProcessCardProps {
  icon: string;
  title: string;
  description?: string;
}

const ProcessCard: React.FC<ProcessCardProps> = ({ icon, title, description = '' }) => {
  return (
    <>
      <div
        className={`flex h-full w-full flex-col rounded-2xl border border-slate-200/80 bg-slate-100/50 p-4`}
      >
        <div className='mb-4 h-8 w-8 md:h-10 md:w-10'>
          <img className='h-full w-full object-contain' src={icon} alt={title} />
        </div>
        <div className='flex-1'>
          <h4 className='mb-1 text-sm font-medium text-gray-900 md:text-base'>{title}</h4>
          <p className='text-xs text-gray-600 md:text-sm'>{description}</p>
        </div>
      </div>
    </>
  );
};

export default ProcessCard;
