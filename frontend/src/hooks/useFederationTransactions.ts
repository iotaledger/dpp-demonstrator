'use client';

import { useCurrentAccount, useIotaClientQuery } from '@iota/dapp-kit';
import { extractAccreditationTransactions } from '@/helpers/federation';
import { FEDERATION_ID } from '@/utils/constants';
import { useHierarchySent } from '@/providers/appProvider';

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
    limit: 20,
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
