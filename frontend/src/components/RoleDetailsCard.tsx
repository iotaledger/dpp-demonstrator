import React from 'react';
import CollapsibleSection from './CollapsibleSection';
import DataGrid from './DataGrid';
import ItemValueRow from './ItemValueRow';
import BadgeWithLink from './BadgeWithLink';
import { useProductDetails } from '@/hooks/useProductDetails';
import { useFederationDetails } from '@/hooks/useFederationDetails';
import { getAllAccreditationsFlat } from '@/helpers/federation';
import { firstLetterUpperCase, truncateAddress } from '@/utils/common';
import { useCurrentAccount } from '@iota/dapp-kit';
import PanelContent from './PanelContent';
import { DPP_ID, FEDERATION_ID } from '@/utils/constants';
import { getAllEntitiesByRole } from '@/helpers/federation';

interface RoleDetailsCardProps {
  opacity?: number;
  delay?: number;
  tutorialState?: 'manufacturerSelected' | 'networkSelected' | 'muted' | 'open-muted' | 'no';
}

// TODO: Implement loading state
const RoleDetailsCard: React.FC<RoleDetailsCardProps> = ({
  opacity = 100,
  delay = 0.4,
  tutorialState = 'no',
}) => {
  // NOTE: I'm using this hook to get the `manufacturer` value, and I aim to use it
  //  in the `useCheckLinkage` hook. But, should I present it here in the Role Details?
  //  The manufactor address bellow do belongs to the manufacture DiD? I don't get it.
  const { isSuccess: isSuccessProductDetails } = useProductDetails(DPP_ID as string);
  const { federationDetails, isSuccess: isSuccessFederationDetails } = useFederationDetails(FEDERATION_ID as string);
  const currentAccount = useCurrentAccount();

  const getCurrentAccountBadge = React.useCallback((otherAddress: string): string | null => {
    return otherAddress === currentAccount?.address ? 'You' : null;
  }, [currentAccount]);

  const allRepairers = React.useMemo(() => {
    if (federationDetails) {
      return getAllAccreditationsFlat(federationDetails!)
    }
    return null;
  }, [federationDetails]);

  const onlyManufacturer = React.useMemo(() => {
    if (federationDetails) {
      return getAllEntitiesByRole(federationDetails, 'manufacturer').at(0);
    }
    return null;
  }, [federationDetails]);

  const getSectionExpanded = () => {
    const open = true;
    const close = false;
    if (tutorialState === 'muted') {
      return close;
    }
    return open;
  }

  const getSectionState = () => {
    if (tutorialState === 'muted' || tutorialState === 'open-muted') {
      return 'muted';
    }
    return 'default';
  }

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
      return 'selected'
    }

    if (tutorialState === 'networkSelected' && rowTag === 'network') {
      return 'selected'
    }

    return 'muted';
  }

  return (
    <CollapsibleSection
      defaultExpanded={getSectionExpanded()}
      cardState={getSectionState()}
      title="Role Details"
      opacity={opacity}
      delay={delay}
    >
      <PanelContent panelState={getPanelState()}>
        <DataGrid gap="gap-y-3 gap-x-6">
          {onlyManufacturer && (
            <ItemValueRow
              rowState={getRowState('manufacturer')}
              key={onlyManufacturer}
              label="Manufacturer"
              value={
                <BadgeWithLink
                  badgeText={"EcoBike"}
                  linkText={truncateAddress(onlyManufacturer)}
                  linkHref={`https://explorer.iota.org/address/${onlyManufacturer}?network=testnet`}
                  // TODO: Implement the accreditation validation
                  showVerification={true}
                />
              }
              showBorder={true}
            />
          )}
          {/* First, renders root authorities as "Service Network" */}
          {isSuccessFederationDetails && (
            federationDetails!.rootAuthorities.map((eachHierarchy) => (
              <ItemValueRow
                rowState={getRowState('network')}
                key={eachHierarchy.id}
                label="Service Network"
                value={
                  <BadgeWithLink
                    badgeText={"Hierarchy"}
                    linkText={truncateAddress(federationDetails?.federationId)}
                    linkHref={`https://explorer.iota.org/object/${federationDetails?.federationId}?network=testnet`}
                  />
                }
                showBorder={true}
              />
            ))
          )}
          {allRepairers?.map((entityId) => (
            <ItemValueRow
              rowState={getRowState(getCurrentAccountBadge(entityId) || '')}
              key={entityId}
              label={'Technician'}
              value={
                <BadgeWithLink
                  badgeText={getCurrentAccountBadge(entityId)}
                  linkText={truncateAddress(entityId)}
                  linkHref={`https://explorer.iota.org/address/${entityId}?network=testnet`}
                />
              }
              showBorder={true}
            />
          ))}
        </DataGrid>
      </PanelContent>
    </CollapsibleSection>
  );
};

export default RoleDetailsCard;
