'use client';

import { useIotaClientQuery } from '@iota/dapp-kit';

import { extractRewardVaultData } from '@/helpers/rewardVault';
import { VAULT_ID } from '@/utils/constants';

// TODO: document the purpose of this hook
export function useRewardVaultDetails() {
  const { data, isSuccess, isLoading, isError } = useIotaClientQuery('getObject', {
    id: VAULT_ID || '',
    options: { showContent: true },
  });

  return {
    rewardDetails: data?.data && extractRewardVaultData(data),
    isSuccess,
    isLoading,
    isError,
  };
}
