/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import { useIotaClientQuery } from '@iota/dapp-kit';

import { extractRewardTotalSupply } from '@/helpers/rewardVault';
import { VAULT_TREASURE_CAP_ID } from '@/utils/constants';

export function useRewardTotalSupply() {
  console.log('loading treasury cap object id: ', VAULT_TREASURE_CAP_ID);
  const { data, isSuccess, isLoading, isError } = useIotaClientQuery('getObject', {
    id: VAULT_TREASURE_CAP_ID,
    options: { showContent: true },
  });

  return {
    totalSupply: data?.data && extractRewardTotalSupply(data),
    isSuccess,
    isLoading,
    isError,
  };
}
