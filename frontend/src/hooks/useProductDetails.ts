'use client';

import { type Dpp, getDppData } from '@/helpers/product';
import { useIotaClientQuery } from '@iota/dapp-kit';

// TODO: what is the purpose of this hook?
export function useProductDetails(dppId: string) {
  const { data, isSuccess, isLoading, isError } = useIotaClientQuery('getObject', {
    id: dppId || '',
    options: { showContent: true },
  });

  return {
    productDetails: data?.data && getDppData(data.data.content as Dpp),
    isSuccess,
    isLoading,
    isError,
  };
}
