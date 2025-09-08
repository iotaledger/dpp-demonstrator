import { extractFederationData } from "@/helpers/federation";
import { type Dpp, getDppData } from "@/helpers/product";
import { isStringEmpty } from "@/utils/common";
import { useIotaClientQuery } from "@iota/dapp-kit";
import { useQuery } from "@tanstack/react-query";
import { useProductDetails } from "./useProductDetails";
import { PRODUCT_DETAILS } from "@/utils/constants";

// TODO: what is the purpose of this hook?
export function useCheckLinkage(did: string) {
  const { isPending, error: isError, isSuccess, data: checkStatus } = useQuery({
    queryKey: [],
    queryFn: () =>
      fetch('http://localhost:3002/api/verify-domain-linkage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ did }),
      }).then((res) => res.json())
  })

  return { isSuccess, isPending, isError, checkStatus };
}
