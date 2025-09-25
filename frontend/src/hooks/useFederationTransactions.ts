
import { useIotaClientQuery } from "@iota/dapp-kit";
import { extractAccreditationTransactions } from "@/helpers/federation";
import { FEDERATION_ID } from "@/utils/constants";
import { useHierarchySent } from "@/providers/appProvider";

// TODO: Document
export function useFederationTransactions() {
  const { isHierarchySent } = useHierarchySent();
  const { data, isSuccess, isLoading, isError } = useIotaClientQuery('queryTransactionBlocks', {
    // @ts-expect-error NOTE: the client omits this property on the return type
    queryKey: [isHierarchySent],
    filter: {
      ChangedObject: FEDERATION_ID || '',
    },
    limit: 5,
    order: 'descending',
    options: {
      showInput: true,
    }
  });

  return {
    accreditations: data && extractAccreditationTransactions(data.data),
    isSuccess,
    isLoading,
    isError,
  };
}
