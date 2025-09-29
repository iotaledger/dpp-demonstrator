'use client';

import React from 'react';

export const EnumerationSection: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className='mx-auto max-w-5xl py-3 md:py-6'>
      <ol className='flex flex-col gap-y-1.5 md:gap-y-3 mx-auto list-decimal'>
        {children}
      </ol>
    </div>
  );
}

export const EnumerationItem = ({ description }: { description: string }) => {
  return (
    <li className='marker:text-blue-600 ml-[2rem]'>{description}</li>
  );
}
