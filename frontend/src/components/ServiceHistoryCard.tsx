'use client';

import React from 'react';

import { useCurrentAccount } from '@iota/dapp-kit';

import { useServiceHistory } from '@/hooks/useServiceHistory';
import { fromPosixMsToUtcDateFormat, getAddressExplorerUrl, getObjectExplorerUrl, getTxBlockExplorerUrl, truncateAddress } from '@/utils/common';
import { REQUEST_SIZE_LIMIT } from '@/utils/constants';

import BadgeWithLink from './BadgeWithLink';
import CollapsibleSection from './CollapsibleSection';
import DataGrid from './DataGrid';
import ItemValueRow from './ItemValueRow';
import PanelContent from './PanelContent';
import { formatLCCBalance } from '@/helpers/rewardVault';

interface ServiceHistoryCardProps {
  dppId?: string;
  opacity?: number;
  delay?: number;
  tutorialState?: 'selected' | 'detailsSelected' | 'rewardSelected' | 'muted' | 'open-muted' | 'no';
  scrollIntoView?: boolean;
}

const ServiceHistoryCard: React.FC<ServiceHistoryCardProps> = ({
  opacity = 100,
  delay = 0.4,
  tutorialState = 'no',
  scrollIntoView = false,
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

  const getCurrentAccountBadge = React.useCallback(
    (otherAddress: string) => {
      if (otherAddress === currentAccount?.address) {
        return <BadgeWithLink badgeText={'You'} spacing='gap-0' />;
      }
      return null;
    },
    [currentAccount],
  );

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
  };

  const getSectionState = () => {
    if (tutorialState === 'muted' || tutorialState === 'open-muted') {
      return 'muted';
    }

    if (
      tutorialState === 'selected' ||
      tutorialState === 'detailsSelected' ||
      tutorialState === 'rewardSelected'
    ) {
      return 'selected';
    }

    return 'default';
  };

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
  };

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
      scrollIntoView={scrollIntoView}
      title='Service History'
      subtitle='Maintenance and Repairs'
      opacity={opacity}
      delay={delay}
    >
      {getServiceEntriesToShow()?.map((serviceEntry) => (
        <PanelContent key={serviceEntry.digest} title='Health Snapshot'>
          <DataGrid gap='gap-y-2 gap-x-6'>
            <ItemValueRow
              rowState={getRowState('detailsSelected')}
              label='Event ID'
              value={
                <div className='flex items-center gap-2'>
                  <a
                    target='_blank'
                    href={getObjectExplorerUrl(serviceEntry?.entryId)}
                    className='text-blue-600 transition-colors hover:text-blue-700'
                  >
                    {truncateAddress(serviceEntry?.entryId)}
                  </a>
                </div>
              }
              fontMono={true}
            />
            <ItemValueRow
              rowState={getRowState('detailsSelected')}
              label='Entry Type'
              value={'Annual Maintenance'}
            />
            <ItemValueRow
              rowState={getRowState('detailsSelected')}
              label='Timestamp'
              value={fromPosixMsToUtcDateFormat(serviceEntry?.timestamp)}
            />

            <hr className='my-1 border-[var(--border)]' />

            {serviceEntry?.healthScore && (
              <ItemValueRow
                rowState={getRowState('detailsSelected')}
                label='Health Score'
                value={serviceEntry.healthScore}
                valueColor='text-gray-900 font-semibold'
              />
            )}
            <ItemValueRow
              rowState={getRowState('detailsSelected')}
              label='Findings'
              value={serviceEntry?.findings || serviceEntry?.serviceDescription}
            />
            <ItemValueRow
              rowState={getRowState('detailsSelected')}
              label='Verification'
              value={
                <div className='flex items-center gap-2'>
                  <p>{'Notarized at block'}</p>
                  <a
                    target='_blank'
                    href={getTxBlockExplorerUrl(serviceEntry.txBlock)}
                    className='text-blue-600 transition-colors hover:text-blue-700'
                  >
                    {truncateAddress(serviceEntry.txBlock)}
                  </a>
                </div>
              }
            />

            <hr className='my-1 border-[var(--border)]' />

            <ItemValueRow
              rowState={getRowState('detailsSelected')}
              label={'Technician'}
              value={
                <div className='flex items-center gap-2'>
                  {getCurrentAccountBadge(serviceEntry?.issuerAddress)}
                  <a
                    target='_blank'
                    href={getAddressExplorerUrl(serviceEntry?.issuerAddress)}
                    className='text-blue-600 transition-colors hover:text-blue-700'
                  >
                    {truncateAddress(serviceEntry?.issuerAddress)}
                  </a>
                </div>
              }
            />

            <hr className='my-1 border-[var(--border)]' />

            <ItemValueRow
              rowState={getRowState('rewardSelected')}
              label='Reward contract'
              value={truncateAddress(serviceEntry?.packageId)}
              fontMono={true}
              valueColor='text-blue-600'
              linkHref={getObjectExplorerUrl(serviceEntry?.packageId as string)}
              isLink={true}
            />
            <ItemValueRow
              rowState={getRowState('rewardSelected')}
              label='Reward Distributed'
              value={`${formatLCCBalance(serviceEntry.rewardBalance)} LCC`}
            />
          </DataGrid>
        </PanelContent>
      ))}
      {serviceEntriesSize > 0 && (
        <div className='mt-6 grid w-full justify-center'>
          {viewMore && (
            <button
              className='focus-visible:ring-ring bg-secondary text-secondary-foreground hover:bg-secondary/80 svelte-1u9y1q3 inline-flex h-10 cursor-pointer items-center justify-center rounded-full px-4 py-2 transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:outline-none active:scale-98 disabled:pointer-events-none disabled:opacity-50'
              onClick={() => setViewMore(false)}
              disabled={isShowMoreDisabled()}
            >
              {`View more (${serviceEntriesSize - 1})`}
            </button>
          )}
          {!viewMore && <ItemsLoadedFeedbackMessage size={serviceEntriesSize} />}
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
  return <div className='py-2 text-center text-sm text-gray-500'>{feedbackMessage()}</div>;
}

export default ServiceHistoryCard;
