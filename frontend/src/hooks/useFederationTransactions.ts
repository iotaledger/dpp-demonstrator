'use client';

import { useCurrentAccount, useIotaClientQuery } from '@iota/dapp-kit';

import { extractAccreditationTransactions } from '@/helpers/federation';
import { useHierarchySent } from '@/providers/appProvider';
import { FEDERATION_ID, REQUEST_SIZE_LIMIT } from '@/utils/constants';

// TODO: Documentation
export function useFederationTransactions() {
  const currentAccount = useCurrentAccount();
  const { isHierarchySent } = useHierarchySent();
  const { data, isSuccess, isLoading, isError } = useIotaClientQuery('queryTransactionBlocks', {
    // @ts-expect-error NOTE: the client omits this property on the return type
    queryKey: [isHierarchySent, currentAccount?.address],
    filter: {
      ChangedObject: FEDERATION_ID || '',
    },
    limit: REQUEST_SIZE_LIMIT,
    order: 'descending',
    options: {
      showInput: true,
    },
  });

  return {
    accreditations:
      data && extractAccreditationTransactions(data.data, currentAccount?.address || null),
    isSuccess,
    isLoading,
    isError,
  };
}
