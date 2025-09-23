import { extractServiceHistoryData } from "@/helpers/serviceHistory";
import { REQUEST_SIZE_LIMIT } from "@/utils/constants";
import { useIotaClientQuery } from "@iota/dapp-kit";

// TODO: document the purpose of this hook
export function useServiceHistory(dppId: string) {
  const { data, isSuccess, isLoading, isError } = useIotaClientQuery('getOwnedObjects', {
    owner: dppId,
    filter: {
      MatchNone: [{ StructType: '0x2::coin::Coin' }],
    },
    cursor: undefined,
    limit: REQUEST_SIZE_LIMIT,
    options: {
      showContent: true,
      showPreviousTransaction: true,
      showOwner: true,
    },
  });

  return {
    serviceHistory: data?.data && extractServiceHistoryData(data),
    isSuccess,
    isLoading,
    isError,
  };
}
