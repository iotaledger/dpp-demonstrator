import React from 'react';
import CollapsibleSection from './CollapsibleSection';
import TwoColumnSection from './TwoColumnSection';
import DataGrid from './DataGrid';
import ItemValueRow from './ItemValueRow';
import { useRewardVaultDetails } from '@/hooks/useRewardVault';
import { getVaultTotalValue } from '@/helpers/rewardVault';
import { truncateAddress } from '@/utils/common';
import PanelContent from './PanelContent';
import { VAULT_ID } from '@/utils/constants';

interface RewardPoolCardProps {
  opacity?: number;
  delay?: number;
  tutorialState?: 'selected' | 'muted' | 'open-muted' | 'no';
}

// TODO: Implement loading state
const RewardPoolCard: React.FC<RewardPoolCardProps> = ({
  opacity = 100,
  delay = 0.4,
  tutorialState = 'no',
}) => {
  const { rewardDetails, isSuccess } = useRewardVaultDetails(VAULT_ID as string);

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
    return 'default';
  }

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
      return 'selected'
    }

    return 'muted';
  }

  return (
    <CollapsibleSection
      defaultExpanded={getSectionExpanded()}
      cardState={getSectionState()}
      title="Reward Pool Status"
      opacity={opacity}
      delay={delay}
    >
      <TwoColumnSection
        gap="gap-4"
        leftColumn={
          <PanelContent panelState={getPanelState()} title={"Lifecycle Credit (LCC) Rewards"}>
            <DataGrid>
              {/* TODO: Truncate the address */}
              <ItemValueRow
                rowState={getRowState('rewardContract')}
                label="Reward contract"
                value={truncateAddress(VAULT_ID as string)}
                columnMaxWidth={250}
                fontMono={true}
                valueColor="text-blue-600"
                isLink={true}
                showBorder={true}
              />
              {/* TODO: Get the supply information contained in the first transaction in the Vault object */}
              <ItemValueRow
                rowState={getRowState('totalLifecycleFund')}
                label="Total Lifecycle Fund"
                value={"1,000,000,000 LCC"}
                columnMaxWidth={250}
                showBorder={true}
              />
              {/* NOTE: This is now hardcoded because the mechanism to reward end-of-live battery is not implemented */}
              <ItemValueRow
                rowState={getRowState('endOfLifeRewards')}
                label="End-of-life Rewards"
                value={"30 LCC"}
                columnMaxWidth={250}
                showBorder={true}
              />
              {/* TODO: Remove the fraction when it is zero */}
              <ItemValueRow
                rowState={getRowState('maintenanceRewardsRemaining')}
                label="Maintenance Rewards remaining"
                value={isSuccess && rewardDetails && getVaultTotalValue(rewardDetails)}
                columnMaxWidth={250}
                showBorder={true}
              />
              {/* NOTE: Supply - Balance */}
              {/* TODO: Get the balance information contained in `rewardDetails` */}
              <ItemValueRow
                rowState={getRowState('used')}
                label="Used"
                value={"<0.001%"}
                columnMaxWidth={250}
                showBorder={true}
              />
            </DataGrid>
          </PanelContent>
        }
        rightColumn={
          <PanelContent title='Reward Table'>
            <DataGrid>
              {/* NOTE: Hardcoded because the mechanism to track this measure is not implemented */}
              <ItemValueRow
                rowState={getRowState('annualMaintenanceReward')}
                label="Annual Maintenance Reward"
                value={"1 LCC"}
                columnMaxWidth={250}
                showBorder={true}
              />
              {/* NOTE: Hardcoded because the mechanism to track this measure is not implemented */}
              <ItemValueRow
                rowState={getRowState('recyclingReward')}
                label="Recycling Reward"
                value={"10 LCC"}
                columnMaxWidth={250}
                showBorder={true}
              />
              {/* NOTE: Hardcoded because the mechanism to track this measure is not implemented */}
              <ItemValueRow
                rowState={getRowState('finalOwner')}
                label="Final owner"
                value={"10 LCC"}
                columnMaxWidth={250}
                showBorder={true}
              />
              {/* NOTE: Hardcoded because the mechanism to track this measure is not implemented */}
              <ItemValueRow
                rowState={getRowState('manufacturerReturn')}
                label="Manufacturer return"
                value={"10 LCC"}
                columnMaxWidth={250}
                showBorder={true}
              />
            </DataGrid>
          </PanelContent>
        }
      />
      <div id="reward-pool-infopanel-slot" className="tutorial-infopanel-slot" />
    </CollapsibleSection>
  );
};

export default RewardPoolCard;
