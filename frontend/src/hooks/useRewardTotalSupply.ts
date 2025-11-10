'use client';

import { useIotaClientQuery } from '@iota/dapp-kit';

import { extractRewardTotalSuply } from '@/helpers/rewardVault';
import { VAULT_TREASURE_CAP_ID } from '@/utils/constants';

export function useRewardTotalSupply() {
  const { data, isSuccess, isLoading, isError } = useIotaClientQuery('getObject', {
    id: VAULT_TREASURE_CAP_ID,
    options: { showContent: true },
  });

  return {
    totalSupply: data?.data && extractRewardTotalSuply(data),
    isSuccess,
    isLoading,
    isError,
  };
}
