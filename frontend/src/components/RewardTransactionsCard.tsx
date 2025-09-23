import React from 'react';
import CollapsibleSection from './CollapsibleSection';
import DataGrid from './DataGrid';
import ItemValueRow from './ItemValueRow';
import BadgeWithLink from './BadgeWithLink';
import { firstLetterUpperCase, formatTokenBalance, fromPosixMsToUtcDateFormat, truncateAddress } from '@/utils/common';
import PanelContent from './PanelContent';
import { VAULT_ID } from '@/utils/constants';
import { useRewardTransactions } from '@/hooks/useRewardTransactions';

interface RewardTransactionsCardProps {
  opacity?: number;
  delay?: number;
  tutorialState?: 'selected' | 'detailsSelected' | 'rewardSelected' | 'muted' | 'open-muted' | 'no';
}

// TODO: Implement loading state
const RewardTransactionsCard: React.FC<RewardTransactionsCardProps> = ({
  opacity = 100,
  delay = 0.4,
  tutorialState = 'no',
}) => {
  const [viewMore, setViewMore] = React.useState(true);
  const { rewardTransactions, isSuccess } = useRewardTransactions(VAULT_ID || '');

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

  return (
    <CollapsibleSection
      defaultExpanded={getSectionExpanded()}
      cardState={getSectionState()}
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
                columnMaxWidth={250}
                fontMono={true}
                showBorder={true}
              />}
            <ItemValueRow
              rowState={getRowState('transactionId')}
              label="Transaction ID"
              value={truncateAddress(rewardEntry.digest)}
              columnMaxWidth={250}
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
              columnMaxWidth={250}
              showBorder={true}
            />
            {!hasTxFailed(rewardEntry.status) &&
              <ItemValueRow
                rowState={getRowState('technician')}
                label="Technician"
                value={truncateAddress(rewardEntry.productEntries.at(0)?.sender)}
                columnMaxWidth={250}
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
              columnMaxWidth={250}
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
            >
              {`View more (${transactionsSize - 1})`}
            </button>
          )}
          {!viewMore && (
            <div className="text-center text-sm text-gray-500 py-2">All transactions shown</div>
          )}
        </div>
      )}
    </CollapsibleSection>
  );
};

export default RewardTransactionsCard;
