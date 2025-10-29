'use client';

import { useIotaClientQuery } from '@iota/dapp-kit';

import { extractRewardTransactionData } from '@/helpers/rewardVaultTransactions';
import { useNotarizationSent } from '@/providers/appProvider';
import { DPP_ID, REQUEST_SIZE_LIMIT, VAULT_ID } from '@/utils/constants';

// TODO: Document
export function useRewardTransactions() {
  const { isNotarizationSent } = useNotarizationSent();
  const { data, isSuccess, isLoading, isError } = useIotaClientQuery('queryTransactionBlocks', {
    // @ts-expect-error NOTE: the client omits this property on the return type
    queryKey: [isNotarizationSent],
    filter: {
      InputObject: VAULT_ID,
    },
    limit: REQUEST_SIZE_LIMIT,
    order: 'descending',
    options: {
      showBalanceChanges: true,
      showEffects: true,
      showEvents: true,
    },
  });

  return {
    rewardTransactions: data && extractRewardTransactionData(data.data, DPP_ID),
    isSuccess,
    isLoading,
    isError,
    hasNextPage: data?.hasNextPage,
    nextCursor: data?.nextCursor,
  };
}
