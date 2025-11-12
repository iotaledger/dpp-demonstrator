/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import { useQuery } from '@tanstack/react-query';

import { DomainLinkageStatusCheck } from '@/types/identity';

export function useCheckLinkage(did: string) {
  const result = useQuery<DomainLinkageStatusCheck>({
    queryKey: [],
    queryFn: () =>
      fetch('/api/verify-domain-linkage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ did }),
      }).then((res) => res.json()),
  });
  const { isPending, error: isError, isSuccess, data: checkStatus } = result;
  return { isSuccess, isPending, isError, checkStatus };
}
