'use client';

import { extractFederationData } from '@/helpers/federation';
import { useIotaClientQuery } from '@iota/dapp-kit';

// TODO: what is the purpose of this hook?
export function useFederationDetails(federationAddress: string) {
  const { data, isSuccess, isLoading, isError } = useIotaClientQuery('getObject', {
    id: federationAddress || '',
    options: { showContent: true },
  });

  return {
    federationDetails: data?.data && extractFederationData(data),
    isSuccess,
    isLoading,
    isError,
  };
}
