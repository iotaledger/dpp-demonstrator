import { extractRewardVaultData, type RewardVaultData } from "@/helpers/rewardVault";
import { isStringEmpty } from "@/utils/common";
import { useIotaClientQuery } from "@iota/dapp-kit";

// TODO: document the purpose of this hook
export function useRewardVaultDetails(vaultId: string) {
  if (isStringEmpty(vaultId)) {
    // - am I breaking any principle?
    // - should I mix validation error with processing error?
    // - what are the implications of this strategy?
    return {
      rewardDetails: null,
      isSuccess: false,
      isLoading: false,
      isError: 'The `vaultId` value must be a non empty string.',
    }
  }

  const { data, isSuccess, isLoading, isError } = useIotaClientQuery('getObject', {
    id: vaultId || '',
    options: { showContent: true },
  });

  return {
    rewardDetails: data?.data && extractRewardVaultData(data as RewardVaultData),
    isSuccess,
    isLoading,
    isError,
  };
}
