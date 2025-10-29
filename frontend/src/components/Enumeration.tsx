'use client';

import React from 'react';

export const EnumerationSection: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className='mx-auto max-w-5xl pt-3 pb-20 md:py-6'>
      <ol className='mx-auto flex list-decimal flex-col gap-y-1.5 md:gap-y-3'>{children}</ol>
    </div>
  );
};

export const EnumerationItem = ({ description }: { description: string }) => {
  return <li className='ml-[2rem] marker:text-blue-600'>{description}</li>;
};
