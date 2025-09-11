import React from 'react';
import CollapsibleSection from './CollapsibleSection';
import TwoColumnSection from './TwoColumnSection';
import DataGrid from './DataGrid';
import ItemValueRow from './ItemValueRow';
import { useRewardVaultDetails } from '@/hooks/useRewardVault';
import { getVaultTotalValue } from '@/helpers/rewardVault';
import { REWARD_POOL_STATUS } from '@/utils/constants';
import { truncateAddress } from '@/utils/common';

interface RewardPoolCardProps {
  rewardContract?: string;
  totalLifecycleFund?: string;
  endOfLifeRewards?: string;
  maintenanceRewardsRemaining?: string;
  usedPercentage?: string;
  annualMaintenanceReward?: string;
  recyclingReward?: string;
  finalOwnerReward?: string;
  manufacturerReturnReward?: string;
  opacity?: number;
  delay?: number;
}

// TODO: Implement loading state
const RewardPoolCard: React.FC<RewardPoolCardProps> = ({
  rewardContract = REWARD_POOL_STATUS.vaultId as string,
  totalLifecycleFund = "1,000,000 LLC",
  endOfLifeRewards = "30 LLC",
  maintenanceRewardsRemaining = "999,969 LLC",
  usedPercentage = "<0.001%",
  annualMaintenanceReward = "1 LLC",
  recyclingReward = "10 LLC",
  finalOwnerReward = "10 LLC",
  manufacturerReturnReward = "10 LLC",
  opacity = 100,
  delay = 0.4
}) => {
  const { rewardDetails, isSuccess } = useRewardVaultDetails(rewardContract);

  React.useEffect(() => {
    if (isSuccess) {
      // console.log('rewards: ', rewardDetails);
    }
  }, [rewardDetails, isSuccess])

  return (
    <section className="px-4 sm:px-6 xl:px-12 max-w-7xl mx-auto py-2 sm:py-3">
      <CollapsibleSection
        title="Reward Pool Status"
        opacity={opacity}
        delay={delay}
      >
        <TwoColumnSection
          gap="gap-4"
          leftColumn={
            <div className="panel space-y-4 border-1 rounded-lg p-4 border-gray-200 transition-all duration-300 ease-out">
              <h3 className="font-medium text-gray-900">Lifecycle Credit (LCC) Rewards</h3>
              <DataGrid>
                {/* TODO: Truncate the address */}
                <ItemValueRow
                  label="Reward contract"
                  value={truncateAddress(rewardContract)}
                  columnMaxWidth={250}
                  fontMono={true}
                  valueColor="text-blue-600"
                  isLink={true}
                  showBorder={true}
                />
                {/* TODO: Get the supply information contained in the first transaction in the Vault object */}
                <ItemValueRow
                  label="Total Lifecycle Fund"
                  value={totalLifecycleFund}
                  columnMaxWidth={250}
                  showBorder={true}
                />
                {/* NOTE: This is now hardcoded because the mechanism to reward end-of-live battery is not implemented */}
                <ItemValueRow
                  label="End-of-life Rewards"
                  value={endOfLifeRewards}
                  columnMaxWidth={250}
                  showBorder={true}
                />
                {/* TODO: Remove the fraction when it is zero */}
                <ItemValueRow
                  label="Maintenance Rewards remaining"
                  value={isSuccess && rewardDetails && getVaultTotalValue(rewardDetails)}
                  columnMaxWidth={250}
                  showBorder={true}
                />
                {/* NOTE: Supply - Balance */}
                {/* TODO: Get the balance information contained in `rewardDetails` */}
                <ItemValueRow
                  label="Used"
                  value={usedPercentage}
                  columnMaxWidth={250}
                  showBorder={true}
                />
              </DataGrid>
            </div>
          }
          rightColumn={
            <div className="panel space-y-4 border-1 rounded-lg p-4 border-gray-200 transition-all duration-300 ease-out">
              <h3 className="font-medium text-gray-900">Reward Table</h3>
              <DataGrid>
                {/* NOTE: Hardcoded because the mechanism to track this measure is not implemented */}
                <ItemValueRow
                  label="Annual Maintenance Reward"
                  value={annualMaintenanceReward}
                  columnMaxWidth={250}
                  showBorder={true}
                />
                {/* NOTE: Hardcoded because the mechanism to track this measure is not implemented */}
                <ItemValueRow
                  label="Recycling Reward"
                  value={recyclingReward}
                  columnMaxWidth={250}
                  showBorder={true}
                />
                {/* NOTE: Hardcoded because the mechanism to track this measure is not implemented */}
                <ItemValueRow
                  label="Final owner"
                  value={finalOwnerReward}
                  columnMaxWidth={250}
                  showBorder={true}
                />
                {/* NOTE: Hardcoded because the mechanism to track this measure is not implemented */}
                <ItemValueRow
                  label="Manufacturer return"
                  value={manufacturerReturnReward}
                  columnMaxWidth={250}
                  showBorder={true}
                />
              </DataGrid>
            </div>
          }
        />
        <div id="reward-pool-infopanel-slot" className="tutorial-infopanel-slot" />
      </CollapsibleSection>
    </section>
  );
};

export default RewardPoolCard;
