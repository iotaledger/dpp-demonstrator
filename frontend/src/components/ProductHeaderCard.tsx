/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useCallback } from 'react';

import { PRODUCT_HEADER } from '@/contents/explore';
import { useProductDetails } from '@/hooks/useProductDetails';

import CollapsibleSection from './CollapsibleSection';

interface ProductHeaderCardProps {
  tutorialState?: 'selected' | 'muted' | 'no';
}

const ProductHeaderCard: React.FC<ProductHeaderCardProps> = ({ tutorialState = 'no' }) => {
  const { isSuccess, productDetails } = useProductDetails();

  const getSectionState = useCallback(() => {
    if (tutorialState === 'muted' || tutorialState === 'selected') {
      return tutorialState;
    }

    return 'default';
  }, [tutorialState]);

  return (
    <CollapsibleSection cardState={getSectionState()} showTitle={false} showButton={false}>
      <div className='flex flex-col sm:flex-row sm:gap-8'>
        {/* Image Container */}
        {isSuccess && (
          <>
            <div className='flex justify-center sm:max-w-xs sm:justify-start'>
              <div className='relative w-full overflow-hidden rounded-lg bg-blue-50'>
                <img
                  className='h-auto w-full object-contain'
                  src={productDetails?.imageUrl}
                  alt={productDetails?.name}
                />
              </div>
            </div>

            {/* Content Container */}
            <div className='flex flex-1 flex-col justify-center space-y-4 pt-3'>
              <div className='space-y-0.5'>
                <div className='text-sm font-medium text-gray-500'>
                  {PRODUCT_HEADER.content.productName}:
                </div>
                <h1 className='text-2xl font-semibold text-gray-900'>{productDetails?.name}</h1>
              </div>
              <div className='space-y-0.5'>
                <div className='text-sm font-medium text-gray-500'>
                  {PRODUCT_HEADER.content.manufacturerName}:
                </div>
                <div className='text-xl font-medium text-gray-900'>
                  {productDetails?.billOfMaterials?.manufacturerName}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </CollapsibleSection>
  );
};

export default ProductHeaderCard;
