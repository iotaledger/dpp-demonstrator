'use client';

import React from 'react';

import { useCurrentAccount } from '@iota/dapp-kit';

import { useFederationTransactions } from '@/hooks/useFederationTransactions';
import { truncateAddress } from '@/utils/common';
import { FEDERATION_ID, MANUFACTURER_DID } from '@/utils/constants';

import BadgeWithLink from './BadgeWithLink';
import CollapsibleSection from './CollapsibleSection';
import DataGrid from './DataGrid';
import ItemValueRow from './ItemValueRow';
import PanelContent from './PanelContent';
import { useProductDetails } from '@/hooks/useProductDetails';
import { BillOfMaterialProperties } from '@/types/product';

interface RoleDetailsCardProps {
  opacity?: number;
  delay?: number;
  tutorialState?: 'manufacturerSelected' | 'networkSelected' | 'muted' | 'open-muted' | 'no';
  scrollIntoView?: boolean;
}

// TODO: Implement loading state
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
      title='Role Details'
      opacity={opacity}
      delay={delay}
    >
      <PanelContent panelState={getPanelState()}>
        <DataGrid gap='gap-y-3 gap-x-6'>
          {isSuccess && (
            <ItemValueRow
              key={MANUFACTURER_DID}
              rowState={getRowState('manufacturer')}
              label='Manufacturer'
              value={
                <BadgeWithLink
                  badgeText={productDetails?.billOfMaterial?.get(BillOfMaterialProperties.ManufacturerName)}
                  linkText={`did:iota:testnet:${truncateAddress(MANUFACTURER_DID)}`}
                  linkHref={`https://explorer.iota.org/object/${MANUFACTURER_DID}?network=testnet`}
                  showVerification={true}
                  verificationDid={productDetails?.manufacturer}
                />
              }
            />
          )}
          <ItemValueRow
            key={FEDERATION_ID}
            rowState={getRowState('network')}
            label='Service Network'
            value={
              <BadgeWithLink
                badgeText={'Hierarchy'}
                linkText={truncateAddress(FEDERATION_ID)}
                linkHref={`https://explorer.iota.org/object/${FEDERATION_ID}?network=testnet`}
              />
            }
          />
          {accreditations?.map((accreditation) => (
            <ItemValueRow
              key={accreditation.receiver}
              rowState={getRowState(getCurrentAccountBadge(accreditation.receiver) || '')}
              label={'Technician'}
              value={
                <BadgeWithLink
                  badgeText={getCurrentAccountBadge(accreditation.receiver)}
                  linkText={truncateAddress(accreditation.receiver)}
                  linkHref={`https://explorer.iota.org/address/${accreditation.receiver}?network=testnet`}
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
