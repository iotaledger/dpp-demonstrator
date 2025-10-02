'use client';

import React from 'react';
import CollapsibleSection from './CollapsibleSection';
import DataGrid from './DataGrid';
import ItemValueRow from './ItemValueRow';
import BadgeWithLink from './BadgeWithLink';
import { formatTokenBalance, fromPosixMsToUtcDateFormat, truncateAddress } from '@/utils/common';
import PanelContent from './PanelContent';
import { REQUEST_SIZE_LIMIT } from '@/utils/constants';
import { useRewardTransactions } from '@/hooks/useRewardTransactions';

interface RewardTransactionsCardProps {
  opacity?: number;
  delay?: number;
  tutorialState?: 'selected' | 'detailsSelected' | 'rewardSelected' | 'muted' | 'open-muted' | 'no';
  scrollIntoView?: boolean;
}

// TODO: Implement loading state
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
      return [_transactions, _transactions.length]
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

  const getRowState = (_target: string) => {
    if (tutorialState === 'selected' || tutorialState === 'no') {
      return 'default';
    }

    return 'muted';
  }

  const hasTxFailed = (status: string) => {
    return status === 'failure';
  };

  const getBadgeText = (status: string) => {
    return !hasTxFailed(status) ? "Reward payout" : "Failed"
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
      title="Rewards transactions"
      subtitle='List of all rewards transactions'
      opacity={opacity}
      delay={delay}
    >
      {getTransactionsToShow()?.map((rewardEntry) => (
        <PanelContent
          key={rewardEntry.digest}
          title='Health Snapshot'
          badge={
            <BadgeWithLink
              badgeText={getBadgeText(rewardEntry.status)}
              spacing="gap-0"
            />
          }
        >
          <DataGrid gap="gap-y-2 gap-x-6">
            {!hasTxFailed(rewardEntry.status) &&
              <ItemValueRow
                rowState={getRowState('serviceId')}
                label="Service ID"
                value={truncateAddress(rewardEntry.productEntries.at(0)?.productAddr)}
                fontMono={true}
                showBorder={true}
              />}
            <ItemValueRow
              rowState={getRowState('transactionId')}
              label="Transaction ID"
              value={truncateAddress(rewardEntry.digest)}
              fontMono={true}
              valueColor="text-blue-600"
              isLink={true}
              linkHref={`https://explorer.iota.org/txblock/${rewardEntry.digest}?network=testnet`}
              showBorder={true}
            />
            <ItemValueRow
              rowState={getRowState('timestamp')}
              label="Timestamp"
              value={fromPosixMsToUtcDateFormat(rewardEntry.timestamp)}
              showBorder={true}
            />
            {!hasTxFailed(rewardEntry.status) &&
              <ItemValueRow
                rowState={getRowState('technician')}
                label="Technician"
                value={truncateAddress(rewardEntry.productEntries.at(0)?.sender)}
                fontMono={true}
                valueColor="text-blue-600"
                isLink={true}
                linkHref={`https://explorer.iota.org/address/${rewardEntry.productEntries.at(0)?.sender}?network=testnet`}
                showBorder={true}
              />}
            <ItemValueRow
              rowState={getRowState('rewardDistributed')}
              label="Reward Distributed"
              value={`${formatTokenBalance(rewardEntry.rewardChanges.at(0)?.amount || '0')} LCC`}
              showBorder={true}
            />
          </DataGrid>
        </PanelContent>
      ))}
      {transactionsSize > 0 && (
        <div className="w-full grid justify-center mt-6">
          {viewMore && (
            <button
              className="inline-flex items-center justify-center rounded-full transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 cursor-pointer focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-98 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2   svelte-1u9y1q3"
              onClick={() => setViewMore(false)}
              disabled={isShowMoreDisabled()}
            >
              {`View more (${transactionsSize - 1})`}
            </button>
          )}
          {!viewMore && (
            <ItemsLoadedFeedbackMessage size={transactionsSize} />
          )}
        </div>
      )}
    </CollapsibleSection>
  );
};

function ItemsLoadedFeedbackMessage({ size }: { size: number }) {
  const feedbackMessage = () => {
    if (size < REQUEST_SIZE_LIMIT) {
      return `All ${size} transactins shown`;
    } else {
      return `All ${size} latest transactions shown`;
    }
  };
  return (
    <div className="text-center text-sm text-gray-500 py-2">
      {feedbackMessage()}
    </div>
  );
}

export default RewardTransactionsCard;
