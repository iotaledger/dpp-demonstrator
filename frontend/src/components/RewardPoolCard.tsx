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
      title='Reward Pool Status'
      opacity={opacity}
      delay={delay}
    >
      <TwoColumnSection
        gap='gap-4'
        leftColumn={
          <PanelContent panelState={getPanelState()} title={'Lifecycle Credit (LCC) Rewards'}>
            <DataGrid>
              <ItemValueRow
                rowState={getRowState('rewardContract')}
                label='Reward contract'
                value={truncateAddress(VAULT_ID)}
                linkHref={getObjectExplorerUrl(VAULT_ID)}
                fontMono={true}
                valueColor='text-blue-600'
                isLink={true}
              />
              <ItemValueRow
                rowState={getRowState('totalLifecycleFund')}
                label='Total Lifecycle Fund'
                value={isTotalSupplyLoaded && totalSupply && rewardDetails && getVaultTotalSupply(totalSupply, rewardDetails) || '0 LCC'}
              />
              {/* NOTE: This is now hardcoded because the mechanism to reward end-of-live battery is not implemented yet */}
              <ItemValueRow
                rowState={getRowState('endOfLifeRewards')}
                label='End-of-life Rewards'
                value={'30 LCC'}
              />
              <ItemValueRow
                rowState={getRowState('maintenanceRewardsRemaining')}
                label='Maintenance Rewards remaining'
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
          <PanelContent title='Reward Table'>
            <DataGrid>
              <ItemValueRow
                rowState={getRowState('annualMaintenanceReward')}
                label='Annual Maintenance Reward'
                value={'1 LCC'}
              />
              <ItemValueRow
                rowState={getRowState('recyclingReward')}
                label='Recycling Reward'
                value={'10 LCC'}
              />
              <ItemValueRow
                rowState={getRowState('finalOwner')}
                label='Final owner'
                value={'10 LCC'}
              />
              <ItemValueRow
                rowState={getRowState('manufacturerReturn')}
                label='Manufacturer return'
                value={'10 LCC'}
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
