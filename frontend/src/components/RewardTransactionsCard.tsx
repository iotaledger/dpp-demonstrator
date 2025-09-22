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
  const { rewardTransactions, isSuccess } = useRewardTransactions(VAULT_ID || '');

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

  return (
    <CollapsibleSection
      defaultExpanded={getSectionExpanded()}
      cardState={getSectionState()}
      title="Rewards transactions"
      subtitle='List of all rewards transactions'
      opacity={opacity}
      delay={delay}
    >
      {isSuccess && rewardTransactions?.transactions.map((rewardEntry) => (
        <PanelContent
          key={rewardEntry.digest}
          title='Health Snapshot'
          badge={
            (
              [
                !hasTxFailed(rewardEntry.status) &&
                <BadgeWithLink
                  badgeText="Reward payout"
                  spacing="gap-0"
                />,
                hasTxFailed(rewardEntry.status) &&
                <BadgeWithLink
                  badgeText="Failed"
                  spacing="gap-0"
                />
              ]
            )
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
    </CollapsibleSection>
  );
};

export default RewardTransactionsCard;
