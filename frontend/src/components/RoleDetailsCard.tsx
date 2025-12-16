/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';

import { useCurrentAccount } from '@iota/dapp-kit';

import { ROLE_DETAILS } from '@/contents/explore';
import { useFederationTransactions } from '@/hooks/useFederationTransactions';
import { useProductDetails } from '@/hooks/useProductDetails';
import {
  getAddressExplorerUrl,
  getDidScheme,
  getObjectExplorerUrl,
  truncateAddress,
} from '@/utils/common';
import { FEDERATION_ID, MANUFACTURER_DID } from '@/utils/constants';

import BadgeWithLink from './BadgeWithLink';
import CollapsibleSection from './CollapsibleSection';
import DataGrid from './DataGrid';
import ItemValueRow from './ItemValueRow';
import PanelContent from './PanelContent';

interface RoleDetailsCardProps {
  opacity?: number;
  delay?: number;
  tutorialState?: 'manufacturerSelected' | 'networkSelected' | 'muted' | 'open-muted' | 'no';
  scrollIntoView?: boolean;
}

const RoleDetailsCard: React.FC<RoleDetailsCardProps> = ({
  opacity = 100,
  delay = 0.4,
  tutorialState = 'no',
  scrollIntoView = false,
}) => {
  const { accreditations } = useFederationTransactions();
  const currentAccount = useCurrentAccount();
  const { isSuccess, productDetails } = useProductDetails();

  const getCurrentAccountBadge = React.useCallback(
    (otherAddress: string): string | null => {
      return otherAddress === currentAccount?.address ? 'You' : null;
    },
    [currentAccount],
  );

  const getSectionExpanded = () => {
    const open = true;
    const close = false;
    if (tutorialState === 'muted') {
      return close;
    }
    return open;
  };

  const getSectionState = () => {
    if (tutorialState === 'muted' || tutorialState === 'open-muted') {
      return 'muted';
    }
    return 'default';
  };

  const getPanelState = () => {
    if (tutorialState === 'manufacturerSelected' || tutorialState === 'networkSelected') {
      return 'selected';
    }

    return 'default';
  };

  const getRowState = (rowTag: string) => {
    if (tutorialState === 'no') {
      return 'default';
    }

    if (tutorialState === 'manufacturerSelected' && rowTag === 'manufacturer') {
      return 'selected';
    }

    if (tutorialState === 'networkSelected' && rowTag === 'network') {
      return 'selected';
    }

    return 'muted';
  };

  return (
    <CollapsibleSection
      defaultExpanded={getSectionExpanded()}
      cardState={getSectionState()}
      scrollIntoView={scrollIntoView}
      title={ROLE_DETAILS.content.title}
      opacity={opacity}
      delay={delay}
    >
      <PanelContent panelState={getPanelState()}>
        <DataGrid gap='gap-y-3 gap-x-6'>
          {isSuccess && (
            <ItemValueRow
              key={MANUFACTURER_DID}
              rowState={getRowState('manufacturer')}
              label={ROLE_DETAILS.content.manufacturerLabel}
              value={
                <BadgeWithLink
                  badgeText={productDetails?.billOfMaterials?.manufacturerName}
                  linkText={getDidScheme(MANUFACTURER_DID)}
                  linkHref={getObjectExplorerUrl(MANUFACTURER_DID)}
                  showVerification={true}
                  // NOTE: The `productDetails?.manufacturer` contains an error
                  // in the Manufacturer ID declared as it is lacking the last digit `7`.
                  // I'm using the manufacturer from environment as a quick fix,
                  // but it should be restored to product's properties when it is updated
                  // or replaced by another product.
                  verificationDid={getDidScheme(MANUFACTURER_DID, false)}
                />
              }
            />
          )}
          <ItemValueRow
            key={FEDERATION_ID}
            rowState={getRowState('network')}
            label={ROLE_DETAILS.content.serviceNetworkLabel}
            value={
              <BadgeWithLink
                badgeText={ROLE_DETAILS.content.hierarchyBadgeLabel}
                linkText={truncateAddress(FEDERATION_ID)}
                linkHref={getObjectExplorerUrl(FEDERATION_ID)}
              />
            }
          />
          {accreditations?.map((accreditation) => (
            <ItemValueRow
              key={accreditation.receiver}
              rowState={getRowState(getCurrentAccountBadge(accreditation.receiver) || '')}
              label={ROLE_DETAILS.content.technicianBadgeLabel}
              value={
                <BadgeWithLink
                  badgeText={getCurrentAccountBadge(accreditation.receiver)}
                  linkText={truncateAddress(accreditation.receiver)}
                  linkHref={getAddressExplorerUrl(accreditation.receiver)}
                />
              }
            />
          ))}
        </DataGrid>
      </PanelContent>
    </CollapsibleSection>
  );
};

export default RoleDetailsCard;
