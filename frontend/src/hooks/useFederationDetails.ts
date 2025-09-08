import { extractFederationData } from "@/helpers/federation";
import { type Dpp, getDppData } from "@/helpers/product";
import { isStringEmpty } from "@/utils/common";
import { useIotaClientQuery } from "@iota/dapp-kit";

// TODO: what is the purpose of this hook?
export function useFederationDetails(federationAddress: string) {
  if (isStringEmpty(federationAddress)) {
    // - am I breaking any principle?
    // - should I mix validation error with processing error?
    // - what are the implications of this strategy?
    return {
      federationDetails: null,
      isSuccess: false,
      isLoading: false,
      isError: 'The `dppId` value must be a non empty string.',
    }
  }

  const { data, isSuccess, isLoading, isError } = useIotaClientQuery('getObject', {
    id: federationAddress || '',
    options: { showContent: true },
  });

  return {
    federationDetails: data?.data && extractFederationData(data),
    isSuccess,
    isLoading,
    isError,
  };
}
