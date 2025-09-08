import { extractServiceHistoryData, type ServiceHistoryData } from "@/helpers/serviceHistory";
import { isStringEmpty } from "@/utils/common";
import { useIotaClientQuery } from "@iota/dapp-kit";

const LIMIT = 20

// TODO: document the purpose of this hook
export function useServiceHistory(dppId: string) {
  if (isStringEmpty(dppId)) {
    // - am I breaking any principle?
    // - should I mix validation error with processing error?
    // - what are the implications of this strategy?
    return {
      serviceHistory: null,
      isSuccess: false,
      isLoading: false,
      isError: 'The `dppId` value must be a non empty string.',
    }
  }

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
