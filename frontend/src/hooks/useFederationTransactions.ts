/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import { useCurrentAccount, useIotaClientQuery } from '@iota/dapp-kit';

import { extractAccreditationTransactions } from '@/helpers/federation';
import { useHierarchySent } from '@/providers/appProvider';
import { FEDERATION_ID, REQUEST_SIZE_LIMIT } from '@/utils/constants';

export function useFederationTransactions() {
  const currentAccount = useCurrentAccount();
  const { isHierarchySent } = useHierarchySent();
  const { data, isSuccess, isLoading, isError } = useIotaClientQuery(
    'queryTransactionBlocks',
    // params
    {
      filter: {
        ChangedObject: FEDERATION_ID || '',
      },
      limit: REQUEST_SIZE_LIMIT,
      order: 'descending',
      options: {
        showInput: true,
      },
    },
    // options
    {
      queryKey: [isHierarchySent, currentAccount?.address],
    },
  );

  return {
    accreditations:
      data && extractAccreditationTransactions(data.data, currentAccount?.address || null),
    isSuccess,
    isLoading,
    isError,
  };
}
