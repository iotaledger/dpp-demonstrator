/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';

interface SlideImageProps {
  src: string;
  alt: string;
}

const SlideImage: React.FC<SlideImageProps> = ({ src, alt }) => {
  return (
    <div className='order-2 flex justify-center md:order-1 md:justify-end'>
      <div className='h-full max-h-[320px] w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-br from-blue-100 to-blue-200'>
        <img src={src} alt={alt} className={'aspect-[4/3] h-full w-full object-contain p-6'} />
      </div>
    </div>
  );
};

export default SlideImage;
