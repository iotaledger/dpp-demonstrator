/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import { useIotaClientQuery } from '@iota/dapp-kit';

import { getDpp } from '@/helpers/product';
import { type DppData } from '@/types/product';
import { DPP_ID } from '@/utils/constants';

export function useProductDetails() {
  const { data, isSuccess, isLoading, isError } = useIotaClientQuery('getObject', {
    id: DPP_ID || '',
    options: { showContent: true },
  });

  return {
    productDetails: data?.data && getDpp(data.data.content as DppData),
    isSuccess,
    isLoading,
    isError,
  };
}
