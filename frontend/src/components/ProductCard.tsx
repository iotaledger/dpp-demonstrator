'use client';

import React from 'react';

interface ProductCardProps {
  icon: string;
  title: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ icon, title }) => {
  return (
    <div
      className={`bg-slate-100/50 border border-slate-200/80 rounded-2xl flex w-full items-center  justify-start gap-2 py-1.5 md:py-3 px-2 md:px-4`}
    >
      <div className='w-6 h-6 flex items-center justify-center'>
        <img className='w-6 h-6' src={icon} alt={title} />
      </div>
      <p className='text-sm md:text-base font-medium text-left'>{title}</p>
    </div>
  );
};

export default ProductCard;
