/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import { usePathname } from 'next/navigation';

const pathsToAutoConnect = ['/explore-guided', '/explore-freely'];

/**
 * Determine if wallet auto connect can be active based on the path.
 * When auto connect is active, it can provoke wallet pop-up when the page loads.
 * It can only be used on client side.
 */
export function useAllowWalletAutoConnect() {
  const pathname = usePathname();
  return pathsToAutoConnect.some((allowedPath) => pathname.includes(allowedPath));
}
