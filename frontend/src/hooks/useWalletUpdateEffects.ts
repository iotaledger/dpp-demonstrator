'use client';

import { useCurrentAccount, useCurrentWallet } from '@iota/dapp-kit';
import React from 'react';
import { useFederationDetails } from './useFederationDetails';
import { useAppProvider, useCurrentNetwork } from '@/providers/appProvider';
import { FEDERATION_ID } from '@/utils/constants';
import { getRolesByEntity } from '@/helpers/federation';
import { generateRequestId } from '@/utils/common';

/**
 * INFO:
 * We can think this hook logic as a facade to detach the dapp-kit managed state
 * from apps's managed state. The components should depends on the app state only,
 * as a single source of truth.
 *
 * WARN:
 * Do not call this hook twiece. Place it in a component that serves the wallet button connection.
 */
export function useWalletUpdateEffects() {
  // From app store
  const {
    state: {
      isWalletConnected,
      isHierarchySent,
      currentAccountAddress,
    },
    handleWalletConnected,
    handleWalletDisconnected,
    handleCurrentAccountAddressChanged,
    handleCurrentAccountNetworkChanged,
    handleHierarchySentSuccess,
    handleNotificationSent,
  } = useAppProvider();

  /**
   * INFO: Effects from primary sources (external ones);
   */

  const {
    isConnected,
    isDisconnected,
  } = useCurrentWallet();
  const currentAccount = useCurrentAccount();

  // Updates the app store when wallet connects.
  React.useEffect(() => {
    if (isConnected && handleWalletConnected) {
      handleWalletConnected();
    }
  }, [isConnected]);

  // Updates the app store when wallet disconnects.
  React.useEffect(() => {
    if (isDisconnected && handleWalletDisconnected) {
      handleWalletDisconnected();
    }
  }, [isDisconnected]);

  // Updates the app store when current account address changes.
  React.useEffect(() => {
    handleCurrentAccountAddressChanged(currentAccount?.address || null);
    handleCurrentAccountNetworkChanged(currentAccount?.chains.at(0) || null);
  }, [currentAccount]);

  /**
   * INFO: Effects from secondary sources (internal state);
   * This kind of effect requires more attention to avoid a loop in the chain of events.
   */

  // Triggers when the stored property isWalletConnect changes.
  React.useEffect(() => {
    // Notify user wallet is connected.
    if (isWalletConnected) {
      handleNotificationSent!({
        id: 'wallet-connect', // a static id avoids duplication during rerenderings
        type: 'success',
        message: 'Wallet connected successfully! You can now request service access.'
      });
    }
  }, [isWalletConnected]);

  const { federationDetails, isSuccess: isSuccessFederationDetails } = useFederationDetails(FEDERATION_ID);
  const { isTestnet } = useCurrentNetwork();

  // Effect event to detach federationDetails retrieval from the effect trigger
  const checkCurrentAccountAddressAccredited = React.useCallback((currentAccountAddress: string) => {
    if (!federationDetails) {
      return false;
    }

    const roles = getRolesByEntity(federationDetails, currentAccountAddress);
    if (roles.some((each) => each === 'repairer')) {
      return true;
    }

    return false;
  }, [federationDetails]);

  // Triggers when wallet is connected, current address is changed and federation details is retrieved
  React.useEffect(() => {
    if (isWalletConnected && isTestnet && currentAccountAddress && isSuccessFederationDetails) {
      if (checkCurrentAccountAddressAccredited(currentAccountAddress)) {
        // mark accreditation as sent, enabling diagnostic
        handleHierarchySentSuccess(generateRequestId());
      }
    }
  }, [isWalletConnected, isTestnet, currentAccountAddress, isSuccessFederationDetails]);

  // Triggers when hierarchy is marked as sent, enabling diagnostic
  React.useEffect(() => {
    if (isHierarchySent) {
      handleNotificationSent!({
        id: 'accreditation-recognition',
        type: 'success',
        message: 'Role request approved! You can now access diagnostic tools.'
      })
    }
  }, [isHierarchySent]);
}
