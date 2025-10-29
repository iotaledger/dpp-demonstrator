'use client';

import { extractServiceTransactionData } from '@/helpers/serviceHistory';
import { useNotarizationSent } from '@/providers/appProvider';
import { DPP_ID, REQUEST_SIZE_LIMIT, VAULT_ID } from '@/utils/constants';
import { useIotaClientQuery } from '@iota/dapp-kit';

// TODO: document the purpose of this hook
export function useServiceHistory() {
  const { isNotarizationSent } = useNotarizationSent();
  const { data, isSuccess, isLoading, isError } = useIotaClientQuery('queryTransactionBlocks', {
    // @ts-expect-error NOTE: the client omits this property on the return type
    queryKey: [isNotarizationSent],
    filter: {
      ChangedObject: VAULT_ID,
    },
    limit: REQUEST_SIZE_LIMIT,
    order: 'descending',
    options: {
      showInput: true,
      showEffects: true,
      showEvents: true,
      showBalanceChanges: true,
    },
  });

  return {
    serviceHistory: data && extractServiceTransactionData(data.data, DPP_ID),
    isSuccess,
    isLoading,
    isError,
  };
}
