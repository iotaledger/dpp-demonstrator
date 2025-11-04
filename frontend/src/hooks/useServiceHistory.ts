'use client';

import { useIotaClientQuery } from '@iota/dapp-kit';

import { extractServiceTransactionData } from '@/helpers/serviceHistory';
import { useNotarizationSent } from '@/providers/appProvider';
import { DPP_ID, REQUEST_SIZE_LIMIT, VAULT_ID } from '@/utils/constants';

// TODO: document the purpose of this hook
export function useServiceHistory() {
  const { isNotarizationSent } = useNotarizationSent();
  const { data, isSuccess, isLoading, isError } = useIotaClientQuery(
    'queryTransactionBlocks',
    // params
    {
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
    },
    // options
    {
      queryKey: [isNotarizationSent],
    }
  );

  return {
    serviceHistory: data && extractServiceTransactionData(data.data, DPP_ID),
    isSuccess,
    isLoading,
    isError,
  };
}
