'use client';

import React from 'react';

import { getVaultRewardBalancePerAddress, getVaultRewardUsagePercentage, getVaultTotalSupply, getVaultTotalValuePerAddress } from '@/helpers/rewardVault';
import { useRewardVaultDetails } from '@/hooks/useRewardVault';
import { getObjectExplorerUrl, truncateAddress } from '@/utils/common';
import { DPP_ID, VAULT_ID } from '@/utils/constants';

import CollapsibleSection from './CollapsibleSection';
import DataGrid from './DataGrid';
import ItemValueRow from './ItemValueRow';
import PanelContent from './PanelContent';
import TwoColumnSection from './TwoColumnSection';
import { useRewardTotalSupply } from '@/hooks/useRewardTotalSupply';
import { EXPLORE } from '@/contents/explore';

interface RewardPoolCardProps {
  opacity?: number;
  delay?: number;
  tutorialState?: 'selected' | 'muted' | 'open-muted' | 'no';
  scrollIntoView?: boolean;
}

const RewardPoolCard: React.FC<RewardPoolCardProps> = ({
  opacity = 100,
  delay = 0.4,
  tutorialState = 'no',
  scrollIntoView = false,
}) => {
  const { rewardDetails, isSuccess } = useRewardVaultDetails();
  const { totalSupply, isSuccess: isTotalSupplyLoaded } = useRewardTotalSupply();

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
    return 'default';
  };

  const getPanelState = () => {
    if (tutorialState === 'selected') {
      return 'selected';
    }
    return 'default';
  };

  const getRowState = (rowTag: string) => {
    if (tutorialState === 'no') {
      return 'default';
    }

    if (tutorialState === 'selected' && rowTag === 'rewardContract') {
      return 'selected';
    }

    return 'muted';
  };

  return (
    <CollapsibleSection
      defaultExpanded={getSectionExpanded()}
      cardState={getSectionState()}
      scrollIntoView={scrollIntoView}
      title={EXPLORE.rewardPool.title}
      opacity={opacity}
      delay={delay}
    >
      <TwoColumnSection
        gap='gap-4'
        leftColumn={
          <PanelContent panelState={getPanelState()} title={EXPLORE.rewardPool.lifecycleCreditTitle}>
            <DataGrid>
              <ItemValueRow
                rowState={getRowState('rewardContract')}
                label={EXPLORE.rewardPool.rewardContractLabel}
                value={truncateAddress(VAULT_ID)}
                linkHref={getObjectExplorerUrl(VAULT_ID)}
                fontMono={true}
                valueColor='text-blue-600'
                isLink={true}
              />
              <ItemValueRow
                rowState={getRowState('totalLifecycleFund')}
                label={EXPLORE.rewardPool.totalLifecycleFundLabel}
                value={isTotalSupplyLoaded && totalSupply && rewardDetails && getVaultTotalSupply(totalSupply, rewardDetails) || EXPLORE.rewardPool.totalLifecycleFundValueFallback}
              />
              {/* NOTE: This is now hardcoded because the mechanism to reward end-of-live battery is not implemented yet */}
              <ItemValueRow
                rowState={getRowState('endOfLifeRewards')}
                label={EXPLORE.rewardPool.endOfLifeRewardsLabel}
                value={EXPLORE.rewardPool.endOfLifeRewardsValueDefault}
              />
              <ItemValueRow
                rowState={getRowState('maintenanceRewardsRemaining')}
                label={EXPLORE.rewardPool.maintenanceRewardsRemainingLabel}
                value={
                  isSuccess && rewardDetails && getVaultTotalValuePerAddress(rewardDetails, DPP_ID)
                }
              />
              <ItemValueRow rowState={getRowState('used')} label='Used'
                value={isSuccess && isTotalSupplyLoaded && totalSupply && rewardDetails && getVaultRewardUsagePercentage(totalSupply, getVaultRewardBalancePerAddress(rewardDetails, DPP_ID))} />
            </DataGrid>
          </PanelContent>
        }
        rightColumn={
          <PanelContent title={EXPLORE.rewardPool.rewardTableTitle}>
            <DataGrid>
              <ItemValueRow
                rowState={getRowState('annualMaintenanceReward')}
                label={EXPLORE.rewardPool.annualMaintenanceRewardLabel}
                value={EXPLORE.rewardPool.annualMaintenanceRewardValueDefault}
              />
              <ItemValueRow
                rowState={getRowState('recyclingReward')}
                label={EXPLORE.rewardPool.recyclingRewardLabel}
                value={EXPLORE.rewardPool.recyclingRewardValueDefault}
              />
              <ItemValueRow
                rowState={getRowState('finalOwner')}
                label={EXPLORE.rewardPool.finalOwnerLabel}
                value={EXPLORE.rewardPool.finalOwnerValueDefault}
              />
              <ItemValueRow
                rowState={getRowState('manufacturerReturn')}
                label={EXPLORE.rewardPool.manufacturerReturnLabel}
                value={EXPLORE.rewardPool.manufacturerReturnValueDefault}
              />
            </DataGrid>
          </PanelContent>
        }
      />
      <div id='reward-pool-infopanel-slot' className='tutorial-infopanel-slot' />
    </CollapsibleSection>
  );
};

export default RewardPoolCard;
