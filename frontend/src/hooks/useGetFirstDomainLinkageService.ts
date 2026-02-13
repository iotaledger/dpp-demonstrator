/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import { useQuery } from '@tanstack/react-query';

import { getFirstDomainLinkageConfigurationUrl } from '@/helpers/domainLinkageConfiguration';

export function useGetFirstDomainLinkageService(did: string) {
  return useQuery<string | null>({
    queryKey: [did],
    async queryFn() {
      return getFirstDomainLinkageConfigurationUrl(did);
    },
  });
}
