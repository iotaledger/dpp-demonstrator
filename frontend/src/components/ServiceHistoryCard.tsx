'use client';

import React from 'react';

import { useCurrentAccount } from '@iota/dapp-kit';

import { useServiceHistory } from '@/hooks/useServiceHistory';
import { fromPosixMsToUtcDateFormat, getAddressExplorerUrl, getObjectExplorerUrl, getTxBlockExplorerUrl, truncateAddress } from '@/utils/common';
import { REWARD_TOKEN_SYMBOL } from '@/utils/constants';

import BadgeWithLink from './BadgeWithLink';
import CollapsibleSection from './CollapsibleSection';
import DataGrid from './DataGrid';
import ItemValueRow from './ItemValueRow';
import PanelContent from './PanelContent';
import { formatLCCBalance } from '@/helpers/rewardVault';
import { EXPLORE } from '@/contents/explore';
import ViewMoreButton from './ViewMoreButton';
import ItemsLoadedFeedbackMessage from './ItemsLoadedFeedbackMessage';

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
      title={EXPLORE.serviceHistory.title}
      subtitle={EXPLORE.serviceHistory.subtitle}
      opacity={opacity}
      delay={delay}
    >
      {getServiceEntriesToShow()?.map((serviceEntry) => (
        <PanelContent key={serviceEntry.digest} title={EXPLORE.serviceHistory.healthSnapshotEventName}>
          <DataGrid gap='gap-y-2 gap-x-6'>
            <ItemValueRow
              rowState={getRowState('detailsSelected')}
              label={EXPLORE.serviceHistory.eventIdLabel}
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
              label={EXPLORE.serviceHistory.entryTypeLabel}
              value={EXPLORE.serviceHistory.entryTypeValue}
            />
            <ItemValueRow
              rowState={getRowState('detailsSelected')}
              label={EXPLORE.serviceHistory.timestampLabel}
              value={fromPosixMsToUtcDateFormat(serviceEntry?.timestamp)}
            />

            <hr className='my-1 border-[var(--border)]' />

            {serviceEntry?.healthScore && (
              <ItemValueRow
                rowState={getRowState('detailsSelected')}
                label={EXPLORE.serviceHistory.healthScoreLabel}
                value={serviceEntry.healthScore}
                valueColor='text-gray-900 font-semibold'
              />
            )}
            <ItemValueRow
              rowState={getRowState('detailsSelected')}
              label={EXPLORE.serviceHistory.findingsLabel}
              value={serviceEntry?.findings || serviceEntry?.serviceDescription}
            />
            <ItemValueRow
              rowState={getRowState('detailsSelected')}
              label={EXPLORE.serviceHistory.verificationLabel}
              value={
                <div className='flex items-center gap-2'>
                  <p>{EXPLORE.serviceHistory.verificationValue}</p>
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
              label={EXPLORE.serviceHistory.technicianLabel}
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
              label={EXPLORE.serviceHistory.rewardContractLabel}
              value={truncateAddress(serviceEntry?.packageId)}
              fontMono={true}
              valueColor='text-blue-600'
              linkHref={getObjectExplorerUrl(serviceEntry?.packageId as string)}
              isLink={true}
            />
            <ItemValueRow
              rowState={getRowState('rewardSelected')}
              label={EXPLORE.serviceHistory.rewardDistributedLabel}
              value={`${formatLCCBalance(serviceEntry.rewardBalance)} ${REWARD_TOKEN_SYMBOL}`}
            />
          </DataGrid>
        </PanelContent>
      ))}
      {serviceEntriesSize > 0 && (
        <div className='mt-6 grid w-full justify-center'>
          {viewMore && (
            <ViewMoreButton amountToReveal={serviceEntriesSize - 1} onClick={() => setViewMore(false)} isDisabled={isShowMoreDisabled()} />
          )}
          {!viewMore && <ItemsLoadedFeedbackMessage size={serviceEntriesSize} />}
        </div>
      )}
    </CollapsibleSection>
  );
};

export default ServiceHistoryCard;
