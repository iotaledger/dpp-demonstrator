'use client';

import React from 'react';

import { useCurrentAccount, useCurrentWallet } from '@iota/dapp-kit';

import { getRolesByEntity } from '@/helpers/federation';
import { useAppProvider } from '@/providers/appProvider';
import { generateRequestId } from '@/utils/common';
import { FEDERATION_ID } from '@/utils/constants';

import { useFederationDetails } from './useFederationDetails';

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
    state: { isWalletConnected, isHierarchySent, currentAccountAddress },
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

  const { isConnected, isDisconnected } = useCurrentWallet();
  const currentAccount = useCurrentAccount();

  // Updates the app store when wallet connects.
  React.useEffect(() => {
    if (isConnected && handleWalletConnected) {
      handleWalletConnected();
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps --
     * The function handleWalletConnected is stable and doesn't require to be a dependency.
     */
  }, [isConnected]);

  // Updates the app store when wallet disconnects.
  React.useEffect(() => {
    if (isDisconnected && handleWalletDisconnected) {
      handleWalletDisconnected();
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps --
     * The function handleWalletDisconnected is stable and doesn't require to be a dependency.
     */
  }, [isDisconnected]);

  // Updates the app store when current account address changes.
  React.useEffect(() => {
    handleCurrentAccountAddressChanged(currentAccount?.address || null);
    handleCurrentAccountNetworkChanged(currentAccount?.chains.at(0) || null);
    /* eslint-disable-next-line react-hooks/exhaustive-deps --
     * The following functions handleCurrentAccountAddressChanged and handleCurrentAccountNetworkChanged
     * are stable and doesn't require to be a dependencies.
     */
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
        message: 'Wallet connected successfully! You can now request service access.',
      });
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps --
     * The function handleNotificationSent is stable and doesn't require to be a dependency.
     */
  }, [isWalletConnected]);

  const { federationDetails, isSuccess: isSuccessFederationDetails } =
    useFederationDetails(FEDERATION_ID);

  // Effect event to detach federationDetails retrieval from the effect trigger
  const checkCurrentAccountAddressAccredited = React.useCallback(
    (currentAccountAddress: string) => {
      if (!federationDetails) {
        return false;
      }

      const roles = getRolesByEntity(federationDetails, currentAccountAddress);
      if (roles.some((each) => each === 'repairer')) {
        return true;
      }

      return false;
    },
    [federationDetails],
  );

  // Triggers when wallet is connected, current address is changed and federation details is retrieved
  React.useEffect(() => {
    if (isWalletConnected && currentAccountAddress && isSuccessFederationDetails) {
      if (checkCurrentAccountAddressAccredited(currentAccountAddress)) {
        // mark accreditation as sent, enabling diagnostic
        handleHierarchySentSuccess(generateRequestId());
      }
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps --
     * The functions handleHierarchySentSuccess and checkCurrentAccountAddressAccredited
     * are stable and doesn't require to be a dependencies.
     */
  }, [isWalletConnected, currentAccountAddress, isSuccessFederationDetails]);

  // Triggers when hierarchy is marked as sent, enabling diagnostic
  React.useEffect(() => {
    if (isHierarchySent) {
      handleNotificationSent!({
        id: 'accreditation-recognition',
        type: 'success',
        message: 'Role request approved! You can now access diagnostic tools.',
      });
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps --
     * The function handleNotificationSent is stable and doesn't require to be a dependency.
     */
  }, [isHierarchySent]);
}
