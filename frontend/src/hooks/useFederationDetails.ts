/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import { useIotaClientQuery } from '@iota/dapp-kit';

import { extractFederationData } from '@/helpers/federation';

export function useFederationDetails(federationAddress: string) {
  const { data, isSuccess, isLoading, isError } = useIotaClientQuery('getObject', {
    id: federationAddress || '',
    options: { showContent: true },
  });

  return {
    federationDetails: data?.data && extractFederationData(data),
    isSuccess,
    isLoading,
    isError,
  };
}
