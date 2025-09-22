import { extractRewardTransactionData } from "@/helpers/rewardVaultTransactions";
import { REQUEST_SIZE_LIMIT } from "@/utils/constants";
import { useIotaClientQuery } from "@iota/dapp-kit";

// TODO: Document
export function useRewardTransactions(valutId: string) {
  const { data, isSuccess, isLoading, isError } = useIotaClientQuery('queryTransactionBlocks', {
    filter: {
      InputObject: valutId,
    },
    limit: REQUEST_SIZE_LIMIT,
    order: 'descending',
    options: {
      showBalanceChanges: true,
      showEffects: true,
      showEvents: true,
    }
  });

  return {
    rewardTransactions: data && extractRewardTransactionData(data.data),
    isSuccess,
    isLoading,
    isError,
    hasNextPage: data?.hasNextPage,
    nextCursor: data?.nextCursor,
  };
}
