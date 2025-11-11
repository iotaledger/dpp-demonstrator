/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';

interface ProductCardProps {
  icon: string;
  title: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ icon, title }) => {
  return (
    <div
      className={`flex w-full items-center justify-start gap-2 rounded-2xl border border-slate-200/80 bg-slate-100/50 px-2 py-1.5 md:px-4 md:py-3`}
    >
      <div className='flex h-6 w-6 items-center justify-center'>
        <img className='h-6 w-6' src={icon} alt={title} />
      </div>
      <p className='text-left text-sm font-medium md:text-base'>{title}</p>
    </div>
  );
};

export default ProductCard;
