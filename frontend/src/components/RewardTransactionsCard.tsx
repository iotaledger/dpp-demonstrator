'use client';

import React from 'react';

import { useRewardTransactions } from '@/hooks/useRewardTransactions';
import { formatTokenBalance, fromPosixMsToUtcDateFormat, getAddressExplorerUrl, getTxBlockExplorerUrl, truncateAddress } from '@/utils/common';

import BadgeWithLink from './BadgeWithLink';
import CollapsibleSection from './CollapsibleSection';
import DataGrid from './DataGrid';
import ItemValueRow from './ItemValueRow';
import PanelContent from './PanelContent';
import { EXPLORE } from '@/contents/explore';
import ViewMoreButton from './ViewMoreButton';
import ItemsLoadedFeedbackMessage from './ItemsLoadedFeedbackMessage';

interface RewardTransactionsCardProps {
  opacity?: number;
  delay?: number;
  tutorialState?: 'selected' | 'detailsSelected' | 'rewardSelected' | 'muted' | 'open-muted' | 'no';
  scrollIntoView?: boolean;
}

const RewardTransactionsCard: React.FC<RewardTransactionsCardProps> = ({
  opacity = 100,
  delay = 0.4,
  tutorialState = 'no',
  scrollIntoView = false,
}) => {
  const [viewMore, setViewMore] = React.useState(true);
  const { rewardTransactions } = useRewardTransactions();

  const [transactions, transactionsSize] = React.useMemo(() => {
    if (rewardTransactions) {
      const _transactions = rewardTransactions?.transactions;
      return [_transactions, _transactions.length];
    }
    return [null, 0];
  }, [rewardTransactions]);

  const getTransactionsToShow = () => {
    if (transactionsSize > 0 && viewMore) {
      // show first entry only
      return transactions?.slice(0, 1);
    }

    if (transactionsSize > 0 && !viewMore) {
      // show all
      return transactions;
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

    if (tutorialState === 'selected') {
      return 'selected';
    }

    return 'default';
  };

  const getRowState = () => {
    if (tutorialState === 'selected' || tutorialState === 'no') {
      return 'default';
    }

    return 'muted';
  };

  const hasTxFailed = (status: string) => {
    return status === 'failure';
  };

  const getBadgeText = (status: string) => {
    return !hasTxFailed(status) ? 'Reward payout' : 'Failed';
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
      title={EXPLORE.rewardTransactions.title}
      subtitle={EXPLORE.rewardTransactions.subtitle}
      opacity={opacity}
      delay={delay}
    >
      {getTransactionsToShow()?.map((rewardEntry) => (
        <PanelContent
          key={rewardEntry.digest}
          title={EXPLORE.rewardTransactions.healthSnapshotEventName}
          badge={<BadgeWithLink badgeText={getBadgeText(rewardEntry.status)} spacing='gap-0' />}
        >
          <DataGrid gap='gap-y-2 gap-x-6'>
            {!hasTxFailed(rewardEntry.status) && (
              <ItemValueRow
                rowState={getRowState()}
                label={EXPLORE.rewardTransactions.serviceIdLabel}
                value={truncateAddress(rewardEntry.productEntries.at(0)?.productAddr)}
                fontMono={true}
              />
            )}
            <ItemValueRow
              rowState={getRowState()}
              label={EXPLORE.rewardTransactions.transactionIdLabel}
              value={truncateAddress(rewardEntry.digest)}
              fontMono={true}
              valueColor='text-blue-600'
              isLink={true}
              linkHref={getTxBlockExplorerUrl(rewardEntry.digest)}
            />
            <ItemValueRow
              rowState={getRowState()}
              label={EXPLORE.rewardTransactions.timestampLabel}
              value={fromPosixMsToUtcDateFormat(rewardEntry.timestamp)}
            />
            {!hasTxFailed(rewardEntry.status) && (
              <ItemValueRow
                rowState={getRowState()}
                label={EXPLORE.rewardTransactions.technicianLabel}
                value={truncateAddress(rewardEntry.productEntries.at(0)?.sender)}
                fontMono={true}
                valueColor='text-blue-600'
                isLink={true}
                linkHref={getAddressExplorerUrl(rewardEntry.productEntries.at(0)?.sender as string)}
              />
            )}
            <ItemValueRow
              rowState={getRowState()}
              label={EXPLORE.rewardTransactions.rewardDistributedLabel}
              value={`${formatTokenBalance(rewardEntry.rewardChanges.at(0)?.amount || '0')} LCC`}
            />
          </DataGrid>
        </PanelContent>
      ))}
      {transactionsSize > 0 && (
        <div className='mt-6 grid w-full justify-center'>
          {viewMore && (
            <ViewMoreButton amountToReveal={transactionsSize - 1} onClick={() => setViewMore(false)} isDisabled={isShowMoreDisabled()} />
          )}
          {!viewMore && <ItemsLoadedFeedbackMessage size={transactionsSize} />}
        </div>
      )}
    </CollapsibleSection>
  );
};

export default RewardTransactionsCard;
