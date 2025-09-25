import React from 'react';
import CollapsibleSection from './CollapsibleSection';
import DataGrid from './DataGrid';
import ItemValueRow from './ItemValueRow';
import BadgeWithLink from './BadgeWithLink';
import { useServiceHistory } from '@/hooks/useServiceHistory';
import { fromPosixMsToUtcDateFormat, generateRequestId, truncateAddress } from '@/utils/common';
import PanelContent from './PanelContent';
import { REQUEST_SIZE_LIMIT } from '@/utils/constants';
import { useCurrentAccount } from '@iota/dapp-kit';
import { ServiceEntry } from '@/helpers/serviceHistory';

interface ServiceHistoryCardProps {
  dppId?: string;
  opacity?: number;
  delay?: number;
  tutorialState?: 'selected' | 'detailsSelected' | 'rewardSelected' | 'muted' | 'open-muted' | 'no';
}

// TODO: Implement loading state
const ServiceHistoryCard: React.FC<ServiceHistoryCardProps> = ({
  opacity = 100,
  delay = 0.4,
  tutorialState = 'no',
}) => {
  const [viewMore, setViewMore] = React.useState(true);
  const { serviceHistory } = useServiceHistory();
  const currentAccount = useCurrentAccount();

  const [serviceEntries, serviceEntriesSize] = React.useMemo(() => {
    if (serviceHistory) {
      return [serviceHistory, serviceHistory.length];
    }
    return [null, 0];
  }, [serviceHistory]);

  const getCurrentAccountBadge = React.useCallback((otherAddress: string) => {
    if (otherAddress === currentAccount?.address) {
      return (
        <BadgeWithLink
          badgeText={'You'}
          spacing="gap-0"
        />
      );
    }
    return null;
  }, [currentAccount]);

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

  const isShowMoreDisabled = () => {
    if (tutorialState === 'muted' || tutorialState === 'open-muted') {
      return true;
    }

    return false;
  };

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
              label="Event ID"
              value={
                <div className="flex items-center gap-2">
                  <a
                    target='_blank'
                    href={`https://explorer.iota.org/object/${serviceEntry?.entryId}?network=testnet`}
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    {truncateAddress(serviceEntry?.entryId)}
                  </a>
                </div>
              }
              columnMaxWidth={250}
              fontMono={true}
              showBorder={true}
            />
            <ItemValueRow
              rowState={getRowState('detailsSelected')}
              label="Entry Type"
              value={"Annual Maintenance"}
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

            <hr className="my-1 border-[var(--border)]" />

            {serviceEntry?.healthScore && (
              <ItemValueRow
                rowState={getRowState('detailsSelected')}
                label="Health Score"
                value={serviceEntry.healthScore}
                columnMaxWidth={250}
                valueColor="text-gray-900 font-semibold"
                showBorder={true}
              />
            )}
            <ItemValueRow
              rowState={getRowState('detailsSelected')}
              label="Findings"
              value={serviceEntry?.findings || serviceEntry?.serviceDescription}
              columnMaxWidth={250}
              showBorder={true}
            />
            <ItemValueRow
              rowState={getRowState('detailsSelected')}
              label="Verification"
              value={
                <div className="flex items-center gap-2">
                  <p>{'Notarized at block'}</p>
                  <a
                    target='_blank'
                    href={`https://explorer.iota.org/txblock/${serviceEntry.txBlock}?network=testnet`}
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    {truncateAddress(serviceEntry.txBlock)}
                  </a>
                </div>
              }
              columnMaxWidth={250}
              showBorder={true}
            />

            <hr className="my-1 border-[var(--border)]" />

            <ItemValueRow
              rowState={getRowState('detailsSelected')}
              label={'Technician'}
              value={
                <div className="flex items-center gap-2">
                  {getCurrentAccountBadge(serviceEntry?.issuerAddress)}
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

            <hr className="my-1 border-[var(--border)]" />

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
              value={"1 LCC"}
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
              disabled={isShowMoreDisabled()}
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
