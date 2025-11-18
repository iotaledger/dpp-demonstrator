/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';

import { createNetworkConfig, IotaClientProvider, WalletProvider } from '@iota/dapp-kit';
import { getFullnodeUrl, Network } from '@iota/iota-sdk/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Layout from '@/components/Layout';
import { AppProvider } from '@/providers/appProvider';

// Required to give style to UI components imported from dapp-kit such as ConnectButton
import '@iota/dapp-kit/dist/index.css';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  const [inNightlyWallet, setInNightlyWallet] = React.useState(false);

  const { networkConfig } = createNetworkConfig({
    // getFullnodeUrl do not support network auto-completion
    //   I've had to read getFullnodeUrl file definition to find Network enum.
    //   Therefore, I believe this can be improved to allow auto-completion and
    //   increase developer experience.
    // It may also worth a contribution to change the README.md file of dapp-kit
    //   to enforce the usage of Network enum in the sample in place of hardcoded
    //   value 'mainnet'.
    testnet: { url: getFullnodeUrl(Network.Testnet) },
    mainnet: { url: getFullnodeUrl(Network.Mainnet) },
  });

  // This effect only works because this module is running on client side.
  // Be aware there is no `window` on server side.
  React.useEffect(() => {
    if (window != null) {
      // @ts-expect-error - NOTE: `nightly` is not found at Window and globalThis
      const nightlyIota = window.nightly?.iota;
      setInNightlyWallet(nightlyIota != null);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <IotaClientProvider networks={networkConfig} defaultNetwork={Network.Testnet}>
        <WalletProvider autoConnect={true}>
          <AppProvider inNightlyWallet={inNightlyWallet}>
            <Layout>{children}</Layout>
            {/* Portal target for modals */}
            <div id='modal-root' />
          </AppProvider>
        </WalletProvider>
      </IotaClientProvider>
    </QueryClientProvider>
  );
}
