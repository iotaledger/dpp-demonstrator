import React from 'react';
import CollapsibleSection from './CollapsibleSection';
import DataGrid from './DataGrid';
import ItemValueRow from './ItemValueRow';
import BadgeWithLink from './BadgeWithLink';
import { useServiceHistory } from '@/hooks/useServiceHistory';
import { firstLetterUpperCase, fromPosixMsToUtcDateFormat, truncateAddress } from '@/utils/common';
import { useFederationDetails } from '@/hooks/useFederationDetails';
import { type FederationData, getAllEntitiesByRole, getRolesByEntity, Role } from '@/helpers/federation';
import PanelContent from './PanelContent';
import { DPP_ID, FEDERATION_ID, REQUEST_SIZE_LIMIT } from '@/utils/constants';

function getRoleByIssuer(federationDetails: FederationData, serviceIssuerAddress: string): string {
  const assignedRoles = getRolesByEntity(federationDetails, serviceIssuerAddress);
  const firstRole = assignedRoles?.at(0);
  return firstRole || '';
}

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
  const [viewMore, setViewMore] = React.useState(true);
  const { serviceHistory } = useServiceHistory(dppId);
  const { federationDetails, isSuccess: isFederationDetailsSuccess } = useFederationDetails(FEDERATION_ID as string);

  const manufacturerEntities = React.useMemo(() => {
    if (isFederationDetailsSuccess && federationDetails) {
      return getAllEntitiesByRole(federationDetails, Role.manufacturer);
    }
    return null;
  }, [federationDetails, isFederationDetailsSuccess]);

  const [serviceEntries, serviceEntriesSize] = React.useMemo(() => {
    if (serviceHistory && federationDetails) {
      const entries = serviceHistory.chronologicalEntries
      return [entries, entries.length];
    }
    return [null, 0];
  }, [serviceHistory, federationDetails]);

  const getServiceEntriesToShow = () => {
    if (serviceEntriesSize > 0 && viewMore) {
      // show first entry only
      return serviceEntries?.slice(0, 1);
    }

    if (serviceEntriesSize > 0 && !viewMore) {
      // show all
      return serviceEntries;
    }

    // there is nothing to show
    return null;
  };

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

  return (
    <CollapsibleSection
      defaultExpanded={getSectionExpanded()}
      cardState={getSectionState()}
      title="Service History"
      subtitle='Maintenance and Repairs'
      opacity={opacity}
      delay={delay}
    >
      {getServiceEntriesToShow()?.map((serviceEntry) => (
        <PanelContent
          key={serviceEntry.digest}
          title='Health Snapshot'
        >
          <DataGrid gap="gap-y-2 gap-x-6">
            <ItemValueRow
              rowState={getRowState('detailsSelected')}
              label="DPP ID"
              value={truncateAddress(serviceEntry?.entryId)}
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
              value={serviceEntry?.serviceType}
              columnMaxWidth={250}
              showBorder={true}
            />
            <ItemValueRow
              rowState={getRowState('detailsSelected')}
              label="Timestamp"
              value={fromPosixMsToUtcDateFormat(serviceEntry?.timestamp)}
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
              value={serviceEntry?.serviceDescription}
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
            {getRoleByIssuer(federationDetails!, serviceEntry.issuerAddress) && (
              <ItemValueRow
                rowState={getRowState('detailsSelected')}
                label={firstLetterUpperCase(getRoleByIssuer(federationDetails!, serviceEntry.issuerAddress))}
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
                      href={`https://explorer.iota.org/address/${serviceEntry?.issuerAddress}?network=testnet`}
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      {truncateAddress(serviceEntry?.issuerAddress)}
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
              value={truncateAddress(serviceEntry?.packageId)}
              columnMaxWidth={250}
              fontMono={true}
              valueColor="text-blue-600"
              linkHref={`https://explorer.iota.org/object/${serviceEntry?.packageId}?network=testnet`}
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
      ))}
      {serviceEntriesSize > 0 && (
        <div className="w-full grid justify-center mt-6">
          {viewMore && (
            <button
              className="inline-flex items-center justify-center rounded-full transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 cursor-pointer focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-98 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2   svelte-1u9y1q3"
              onClick={() => setViewMore(false)}
            >
              {`View more (${serviceEntriesSize - 1})`}
            </button>
          )}
          {!viewMore && (
            <ItemsLoadedFeedbackMessage size={serviceEntriesSize} />
          )}
        </div>
      )}
    </CollapsibleSection>
  );
};

function ItemsLoadedFeedbackMessage({ size }: { size: number }) {
  const feedbackMessage = () => {
    if (size < REQUEST_SIZE_LIMIT) {
      return `All ${size} entries shown`;
    } else {
      return `All ${size} latest entries shown`;
    }
  };
  return (
    <div className="text-center text-sm text-gray-500 py-2">
      {feedbackMessage()}
    </div>
  );
}

export default ServiceHistoryCard;
