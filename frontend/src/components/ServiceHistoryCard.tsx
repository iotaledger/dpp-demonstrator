/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';

import { useCurrentAccount } from '@iota/dapp-kit';

import { SERVICE_HISTORY } from '@/contents/explore';
import { formatLCCBalance } from '@/helpers/rewardVault';
import { useServiceHistory } from '@/hooks/useServiceHistory';
import {
  fromPosixMsToUtcDateFormat,
  getAddressExplorerUrl,
  getObjectExplorerUrl,
  getTxBlockExplorerUrl,
  truncateAddress,
} from '@/utils/common';
import { REWARD_TOKEN_SYMBOL } from '@/utils/constants';

import BadgeWithLink from './BadgeWithLink';
import CollapsibleSection from './CollapsibleSection';
import DataGrid from './DataGrid';
import ItemsLoadedFeedbackMessage from './ItemsLoadedFeedbackMessage';
import ItemValueRow from './ItemValueRow';
import PanelContent from './PanelContent';
import ViewMoreButton from './ViewMoreButton';

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
      title={SERVICE_HISTORY.content.title}
      subtitle={SERVICE_HISTORY.content.subtitle}
      opacity={opacity}
      delay={delay}
    >
      {getServiceEntriesToShow()?.map((serviceEntry) => (
        <PanelContent
          key={serviceEntry.digest}
          title={SERVICE_HISTORY.content.healthSnapshotEventName}
        >
          <DataGrid gap='gap-y-2 gap-x-6'>
            <ItemValueRow
              rowState={getRowState('detailsSelected')}
              label={SERVICE_HISTORY.content.eventIdLabel}
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
              label={SERVICE_HISTORY.content.entryTypeLabel}
              value={SERVICE_HISTORY.content.entryTypeValue}
            />
            <ItemValueRow
              rowState={getRowState('detailsSelected')}
              label={SERVICE_HISTORY.content.timestampLabel}
              value={fromPosixMsToUtcDateFormat(serviceEntry?.timestamp)}
            />

            <hr className='my-1 border-[var(--border)]' />

            {serviceEntry?.healthScore && (
              <ItemValueRow
                rowState={getRowState('detailsSelected')}
                label={SERVICE_HISTORY.content.healthScoreLabel}
                value={serviceEntry.healthScore}
                valueColor='text-gray-900 font-semibold'
              />
            )}
            <ItemValueRow
              rowState={getRowState('detailsSelected')}
              label={SERVICE_HISTORY.content.findingsLabel}
              value={serviceEntry?.findings || serviceEntry?.serviceDescription}
            />
            <ItemValueRow
              rowState={getRowState('detailsSelected')}
              label={SERVICE_HISTORY.content.verificationLabel}
              value={
                <div className='flex items-center gap-2'>
                  <p>{SERVICE_HISTORY.content.verificationValue}</p>
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
              label={SERVICE_HISTORY.content.technicianLabel}
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
              label={SERVICE_HISTORY.content.rewardContractLabel}
              value={truncateAddress(serviceEntry?.packageId)}
              fontMono={true}
              valueColor='text-blue-600'
              linkHref={getObjectExplorerUrl(serviceEntry?.packageId as string)}
              isLink={true}
            />
            <ItemValueRow
              rowState={getRowState('rewardSelected')}
              label={SERVICE_HISTORY.content.rewardDistributedLabel}
              value={`${formatLCCBalance(serviceEntry.rewardBalance)} ${REWARD_TOKEN_SYMBOL}`}
            />
          </DataGrid>
        </PanelContent>
      ))}
      {serviceEntriesSize > 0 && (
        <div className='mt-6 grid w-full justify-center'>
          {viewMore && (
            <ViewMoreButton
              amountToReveal={serviceEntriesSize - 1}
              onClick={() => setViewMore(false)}
              isDisabled={isShowMoreDisabled()}
            />
          )}
          {!viewMore && <ItemsLoadedFeedbackMessage size={serviceEntriesSize} />}
        </div>
      )}
    </CollapsibleSection>
  );
};

export default ServiceHistoryCard;
