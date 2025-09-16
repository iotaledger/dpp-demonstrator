import { extractServiceHistoryData } from "@/helpers/serviceHistory";
import { useIotaClientQuery } from "@iota/dapp-kit";

// TODO: migrate to constant
const LIMIT = 20

// TODO: document the purpose of this hook
export function useServiceHistory(dppId: string) {
  const { data, isSuccess, isLoading, isError } = useIotaClientQuery('getOwnedObjects', {
    owner: dppId,
    filter: {
      MatchNone: [{ StructType: '0x2::coin::Coin' }],
    },
    cursor: undefined,
    limit: LIMIT,
    options: {
      showContent: true,
    },
  });

  return {
    serviceHistory: data?.data && extractServiceHistoryData(data),
    isSuccess,
    isLoading,
    isError,
  };
}
