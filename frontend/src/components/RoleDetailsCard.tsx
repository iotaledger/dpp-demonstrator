import React from 'react';
import CollapsibleSection from './CollapsibleSection';
import DataGrid from './DataGrid';
import ItemValueRow from './ItemValueRow';
import BadgeWithLink from './BadgeWithLink';
import { useFederationDetails } from '@/hooks/useFederationDetails';
import { getAllAccreditationsFlat } from '@/helpers/federation';
import { truncateAddress } from '@/utils/common';
import { useCurrentAccount } from '@iota/dapp-kit';
import PanelContent from './PanelContent';
import { FEDERATION_ID } from '@/utils/constants';
import { getAllEntitiesByRole } from '@/helpers/federation';
import { useFederationTransactions } from '@/hooks/useFederationTransactions';
import { useAppProvider } from '@/providers/appProvider';

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
  const { federationDetails, isSuccess: isSuccessFederationDetails } = useFederationDetails(FEDERATION_ID);
  const { accreditations } = useFederationTransactions();
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
              key={onlyManufacturer}
              rowState={getRowState('manufacturer')}
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
                key={eachHierarchy.id}
                rowState={getRowState('network')}
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
              showBorder={true}
            />
          ))}
        </DataGrid>
      </PanelContent>
    </CollapsibleSection>
  );
};

export default RoleDetailsCard;
