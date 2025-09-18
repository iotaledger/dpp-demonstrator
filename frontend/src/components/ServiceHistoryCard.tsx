import React from 'react';
import CollapsibleSection from './CollapsibleSection';
import DataGrid from './DataGrid';
import ItemValueRow from './ItemValueRow';
import BadgeWithLink from './BadgeWithLink';
import { useServiceHistory } from '@/hooks/useServiceHistory';
import { firstLetterUpperCase, fromPosixMsToUtcDateFormat, truncateAddress } from '@/utils/common';
import { useFederationDetails } from '@/hooks/useFederationDetails';
import { getAllEntitiesByRole, getRolesByEntity, Role } from '@/helpers/federation';
import PanelContent from './PanelContent';
import { DPP_ID, FEDERATION_ID } from '@/utils/constants';

interface ServiceHistoryCardProps {
  dppId?: string;
  opacity?: number;
  delay?: number;
  tutorialState?: 'selected' | 'detailsSelected' | 'rewardSelected' | 'muted' | 'open-muted' | 'no';
}

// TODO: Implement loading state
const ServiceHistoryCard: React.FC<ServiceHistoryCardProps> = ({
  dppId = DPP_ID as string,
  opacity = 100,
  delay = 0.4,
  tutorialState = 'no',
}) => {
  const { serviceHistory, isSuccess } = useServiceHistory(dppId);
  const { federationDetails, isSuccess: isFederationDetailsSuccess } = useFederationDetails(FEDERATION_ID as string);
  /**
   * NOTE: I'm extracting the latestService because the UI seems to be only interested in it.
   */
  const latestService = React.useMemo(() => {
    const lastService = serviceHistory?.chronologicalEntries.slice(-1).pop();
    return lastService ?? null;
  }, [serviceHistory]);

  const manufacturerEntities = React.useMemo(() => {
    if (isFederationDetailsSuccess && federationDetails) {
      return getAllEntitiesByRole(federationDetails, Role.manufacturer);
    }
    return null;
  }, [federationDetails, isFederationDetailsSuccess]);

  const latestServiceRole = React.useMemo(() => {
    if (isFederationDetailsSuccess && federationDetails && latestService) {
      const assignedRoles = getRolesByEntity(federationDetails, latestService.issuerAddress);
      const firstRole = assignedRoles.at(0);
      return firstRole;
    }
  }, [latestService, federationDetails, isFederationDetailsSuccess])

  React.useEffect(() => {
    if (isSuccess) {
      console.log('service history extracted: ', serviceHistory);
    }
  }, [serviceHistory, isSuccess])

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

    if (tutorialState === 'selected') {
      return 'selected';
    }

    return 'default';
  }

  const getRowState = (target: 'detailsSelected' | 'rewardSelected') => {
    if (tutorialState === 'selected' || tutorialState === 'no') {
      return 'default';
    }

    if (tutorialState === 'detailsSelected' && target === 'detailsSelected') {
      return 'default';
    }

    if (tutorialState === 'rewardSelected' && target === 'rewardSelected') {
      return 'default';
    }

    return 'muted';
  }

  // TODO: Bind the service history entries to the cards
  return (
    <CollapsibleSection
      defaultExpanded={getSectionExpanded()}
      cardState={getSectionState()}
      title="Service History"
      subtitle='Maintenance and Repairs'
      opacity={opacity}
      delay={delay}
    >
      <PanelContent
        title='Health Snapshot'
        badge={
          <BadgeWithLink
            badgeText="#1"
            spacing="gap-0"
          />
        }>
        <DataGrid gap="gap-y-2 gap-x-6">
          <ItemValueRow
            rowState={getRowState('detailsSelected')}
            label="DPP ID"
            value={truncateAddress(latestService?.entryId)}
            columnMaxWidth={250}
            fontMono={true}
            valueColor="text-blue-600"
            isLink={true}
            linkHref={`https://explorer.iota.org/object/${dppId}?network=testnet`}
            showBorder={true}
          />
          <ItemValueRow
            rowState={getRowState('detailsSelected')}
            label="Entry Type"
            value={latestService?.serviceType}
            columnMaxWidth={250}
            showBorder={true}
          />
          <ItemValueRow
            rowState={getRowState('detailsSelected')}
            label="Timestamp"
            value={fromPosixMsToUtcDateFormat(latestService?.timestamp)}
            columnMaxWidth={250}
            showBorder={true}
          />

          <hr className="my-1 border-gray-200" />

          {/* NOTE: Hardcoded */}
          {/* TODO: How do I calculate it? */}
          <ItemValueRow
            rowState={getRowState('detailsSelected')}
            label="Health Score"
            value={"99.98%"}
            columnMaxWidth={250}
            valueColor="text-gray-900 font-semibold"
            showBorder={true}
          />
          <ItemValueRow
            rowState={getRowState('detailsSelected')}
            label="Findings"
            value={latestService?.serviceDescription}
            columnMaxWidth={250}
            showBorder={true}
          />
          {/* NOTE: Hardcoded, It shows the info: "Notarized at (Epoch 512) block 0x9ef...429e" */}
          {/* TODO: How do I get this? */}
          <ItemValueRow
            rowState={getRowState('detailsSelected')}
            label="Verification"
            value={"Notarized at (Epoch 512) block 0x9ef...429e"}
            columnMaxWidth={250}
            showBorder={true}
          />

          <hr className="my-1 border-gray-200" />

          {manufacturerEntities && manufacturerEntities.map((entityAddress) => (
            <ItemValueRow
              rowState={getRowState('detailsSelected')}
              key={entityAddress}
              label="Manufacturer"
              value={
                <div className="flex items-center gap-2">
                  {/* NOTE: Hardcoded */}
                  {/* TODO: Get manufacturer name from product details */}
                  <BadgeWithLink
                    badgeText={"EcoBike"}
                    spacing="gap-0"
                  />
                  <a
                    target='_blank'
                    href={`https://explorer.iota.org/address/${entityAddress}?network=testnet`}
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    {truncateAddress(entityAddress)}
                  </a>
                </div>
              }
              columnMaxWidth={250}
              showBorder={true}
            />
          ))}
          {latestServiceRole && (
            <ItemValueRow
              rowState={getRowState('detailsSelected')}
              label={firstLetterUpperCase(latestServiceRole)}
              value={
                <div className="flex items-center gap-2">
                  {/* NOTE: Hardcoded */}
                  {/* TODO: How do I get the technician name? */}
                  <BadgeWithLink
                    badgeText={"Prev. Technician"}
                    spacing="gap-0"
                  />
                  <a
                    target='_blank'
                    href={`https://explorer.iota.org/address/${latestService?.issuerAddress}?network=testnet`}
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    {truncateAddress(latestService?.issuerAddress)}
                  </a>
                </div>
              }
              columnMaxWidth={250}
              showBorder={true}
            />
          )}

          <hr className="my-1 border-gray-200" />

          <ItemValueRow
            rowState={getRowState('rewardSelected')}
            label="Reward contract"
            value={truncateAddress(latestService?.packageId)}
            columnMaxWidth={250}
            fontMono={true}
            valueColor="text-blue-600"
            linkHref={`https://explorer.iota.org/object/${latestService?.packageId}?network=testnet`}
            isLink={true}
            showBorder={true}
          />
          {/* NOTE: Hardcoded, Sum of all rewards given */}
          {/* TODO: Discover a way to get this information from the reward contract. Maybe analysing calls to  */}
          <ItemValueRow
            rowState={getRowState('rewardSelected')}
            label="Reward Distributed"
            value={"1 RWR"}
            columnMaxWidth={250}
            showBorder={true}
          />
        </DataGrid>
      </PanelContent>
      <div className="w-full grid justify-center mt-6">
        {/* Placeholder for additional content */}
      </div>
    </CollapsibleSection>
  );
};

export default ServiceHistoryCard;
