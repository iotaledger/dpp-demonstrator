'use client';

import React, { useEffectEvent } from 'react';

import type { WalletAccount } from '@iota/wallet-standard';

import { useCurrentAccount, useCurrentWallet } from '@iota/dapp-kit';

import { NOTIFICATION } from '@/contents/notification';
import { getRolesByEntity } from '@/helpers/federation';
import { useAppProvider } from '@/providers/appProvider';
import { Roles } from '@/types/identity';
import { generateRequestId } from '@/utils/common';
import { FEDERATION_ID } from '@/utils/constants';

import { useFederationDetails } from './useFederationDetails';

/**
 * NOTE:
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

  const { isConnected, isDisconnected } = useCurrentWallet();
  const currentAccount = useCurrentAccount();
  const onWalletConnected = useEffectEvent(() => {
    if (handleWalletConnected) {
      handleWalletConnected();
    }
  });
  const onWalletDisconnected = useEffectEvent(() => {
    if (handleWalletDisconnected) {
      handleWalletDisconnected();
    }
  });
  const onCurrentAccountChanged = useEffectEvent((currentAccount: WalletAccount | null) => {
    handleCurrentAccountAddressChanged(currentAccount?.address || null);
    handleCurrentAccountNetworkChanged(currentAccount?.chains.at(0) || null);
  });

  /**
   * INFO: Effects from primary sources (external ones);
   */

  // Updates the app store when wallet connects.
  React.useEffect(() => {
    if (isConnected) {
      onWalletConnected();
    }
  }, [isConnected]);

  // Updates the app store when wallet disconnects.
  React.useEffect(() => {
    if (isDisconnected) {
      onWalletDisconnected();
    }
  }, [isDisconnected]);

  // Updates the app store when current account address changes.
  React.useEffect(() => {
    onCurrentAccountChanged(currentAccount);
  }, [currentAccount]);

  /**
   * INFO: Effects from secondary sources (internal state);
   * This kind of effect requires more attention to avoid a loop in the chain of events.
   */

  const { federationDetails, isSuccess: isSuccessFederationDetails } =
    useFederationDetails(FEDERATION_ID);

  // Effect event to detach federationDetails retrieval from the effect trigger
  const checkCurrentAccountAddressAccredited = React.useCallback(
    (currentAccountAddress: string) => {
      if (!federationDetails) {
        return false;
      }

      const roles = getRolesByEntity(federationDetails, currentAccountAddress);
      if (roles.some((each) => each === Roles.Repairer.id)) {
        return true;
      }

      return false;
    },
    [federationDetails],
  );

  const onStoreWalletConnected = useEffectEvent(() => {
    handleNotificationSent!({
      id: 'wallet-connect', // a static id avoids duplication during rerenderings
      type: 'success',
      message: NOTIFICATION.content.connectedWallet,
    });
  });
  const onStoreWalletAccountAccreditationCheck = useEffectEvent((currentAccountAddress: string) => {
    if (checkCurrentAccountAddressAccredited(currentAccountAddress)) {
      // mark accreditation as sent, enabling diagnostic
      handleHierarchySentSuccess(generateRequestId());
    }
  });
  const onStoreWalletAccountAccredited = useEffectEvent(() => {
    handleNotificationSent!({
      id: 'accreditation-recognition',
      type: 'success',
      message: NOTIFICATION.content.approvedRole,
    });
  });

  // Triggers when the stored property isWalletConnect changes.
  React.useEffect(() => {
    // Notify user wallet is connected.
    if (isWalletConnected) {
      onStoreWalletConnected();
    }
  }, [isWalletConnected]);

  // Triggers when wallet is connected, current address is changed and federation details is retrieved
  React.useEffect(() => {
    if (isWalletConnected && currentAccountAddress && isSuccessFederationDetails) {
      onStoreWalletAccountAccreditationCheck(currentAccountAddress);
    }
  }, [isWalletConnected, currentAccountAddress, isSuccessFederationDetails]);

  // Triggers when hierarchy is marked as sent, enabling diagnostic
  React.useEffect(() => {
    if (isHierarchySent) {
      onStoreWalletAccountAccredited();
    }
  }, [isHierarchySent]);
}
