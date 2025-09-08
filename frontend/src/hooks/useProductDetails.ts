import { type Dpp, getDppData } from "@/helpers/product";
import { isStringEmpty } from "@/utils/common";
import { useIotaClientQuery } from "@iota/dapp-kit";

// TODO: what is the purpose of this hook?
export function useProductDetails(dppId: string) {
  if (isStringEmpty(dppId)) {
    // - am I breaking any principle?
    // - should I mix validation error with processing error?
    // - what are the implications of this strategy?
    return {
      produtDetails: null,
      isSuccess: false,
      isLoading: false,
      isError: 'The `dppId` value must be a non empty string.',
    }
  }

  const { data, isSuccess, isLoading, isError } = useIotaClientQuery('getObject', {
    id: dppId || '',
    options: { showContent: true },
  });

  return {
    productDetails: data?.data && getDppData(data.data.content as Dpp),
    isSuccess,
    isLoading,
    isError,
  };
}
