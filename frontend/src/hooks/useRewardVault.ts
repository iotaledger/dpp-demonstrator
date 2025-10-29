'use client';

import { useIotaClientQuery } from '@iota/dapp-kit';

import { extractRewardVaultData } from '@/helpers/rewardVault';

// TODO: document the purpose of this hook
export function useRewardVaultDetails(vaultId: string) {
  const { data, isSuccess, isLoading, isError } = useIotaClientQuery('getObject', {
    id: vaultId || '',
    options: { showContent: true },
  });

  return {
    rewardDetails: data?.data && extractRewardVaultData(data),
    isSuccess,
    isLoading,
    isError,
  };
}
