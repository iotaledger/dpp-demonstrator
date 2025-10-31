'use client';

import { useIotaClientQuery } from '@iota/dapp-kit';

import { getDpp } from '@/helpers/product';
import { DPP_ID } from '@/utils/constants';
import { type Dpp } from '@/types/product';

// TODO: what is the purpose of this hook?
export function useProductDetails() {
  const { data, isSuccess, isLoading, isError } = useIotaClientQuery('getObject', {
    id: DPP_ID || '',
    options: { showContent: true },
  });

  return {
    productDetails: data?.data && getDpp(data.data.content as Dpp),
    isSuccess,
    isLoading,
    isError,
  };
}
