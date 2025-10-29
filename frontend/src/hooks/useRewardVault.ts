'use client';

import { extractRewardVaultData } from '@/helpers/rewardVault';
import { useIotaClientQuery } from '@iota/dapp-kit';

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
