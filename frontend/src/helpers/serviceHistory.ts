import type { BalanceChange } from '@iota/iota-sdk/client';

import { IotaEvent, IotaTransactionBlockResponse, OwnedObjectRef } from '@iota/iota-sdk/client';

import { ServiceEntry } from '@/types/transaction';

/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

/*
Service History Data Structure:
┌─────────────────────────────────────────────────────────────────────┐
│                  Service History Collection                         │
│ Paginated ProductEntry Objects for DPP Custom Notarization          │
├─────────────────────────────────────────────────────────────────────┤
│ Service Entries Array:                                              │
│ ┌─ Entry 1 (0x8f07f169...)                                          │
│   ├─ Service: "Inspection" → "Test Service"                         │
│   ├─ Issuer: 0x5ddf340c... (Repairer)                               │
│   ├─ Timestamp: 1756128614445                                       │
│   └─ Package: 0x1d0b1bdb... (DPP App)                               │
│ ├─ Entry 2 (0xeee8d514...)                                          │
│   ├─ Service: "Inspection" → "Second Test"                          │
│   ├─ Issuer: 0x1f9699f7... (Repairer)                               │
│   └─ Timestamp: 1756129169058                                       │
│ └─ Entry N...                                                       │
├─────────────────────────────────────────────────────────────────────┤
│ Indexing Maps:                                                      │
│ ├─ By Entry ID → ServiceEntry                                       │
│ ├─ By Issuer → [ServiceEntry, ...]                                  │
│ ├─ By Service Type → [ServiceEntry, ...]                            │
│ └─ Chronological → [ServiceEntry, ...] (sorted)                     │
├─────────────────────────────────────────────────────────────────────┤
│ Pagination Context:                                                 │
│ ├─ Has Next Page: boolean                                           │
│ └─ Next Cursor: objectId for continuation                           │
└─────────────────────────────────────────────────────────────────────┘

Service History Hierarchy:
Product → Service Events → Provider Documentation → Custom Notarization

Service Flow:
Product Lifecycle → Service Performed → Provider Documents → History Recorded → Custom Notarization
*/

/**
 * Extracts and transforms service history data from IOTA Rebase JSON-RPC response
 *
 * This function processes paginated ProductEntry objects and creates
 * a frontend-friendly data structure with multiple indexing strategies.
 *
 * Process Flow:
 * ┌─ JSON Input ─┐    ┌─ Extract ─┐    ┌─ Transform ─┐    ┌─ Output ─┐
 * │ Paginated    │ →  │ Entries   │ →  │ Create Maps │ →  │ Indexed  │
 * │ Objects      │    │ Metadata  │    │ Sort Data   │    │ History  │
 * │              │    │ Pagination│    │             │    │          │
 * └──────────────┘    └───────────┘    └─────────────┘    └──────────┘
 *
 * @param jsonData - The JSON-RPC response from iotax_getOwnedObjects call
 * @returns ServiceEntry array with extracted and organized information
 *
 * @example
 * ```typescript
 * const response = await fetch('https://api.testnet.iota.cafe/', {
 *   method: 'POST',
 *   body: JSON.stringify({
 *     jsonrpc: "2.0",
 *     id: 1,
 *     method: "iotax_getOwnedObjects",
 *     params: ["0x04c545450fa0b988...", {
 *       filter: {"MatchNone": [{"StructType": "0x2::coin::Coin"}]},
 *       options: {"showContent": true}
 *     }, null, 20]
 *   })
 * });
 * const jsonData = await response.json();
 * const historyData = extractServiceTransactionData(jsonData);
 * console.log(`Loaded ${historyData.entries.length} service entries`);
 * ```
 */
function extractServiceTransactionData(
  jsonData: IotaTransactionBlockResponse[],
  productIdToFilter: string,
): ServiceEntry[] {
  const transactionEntries = jsonData.map((tx) => {
    const _transactionsCall = // @ts-expect-error -- Inference do not catch all possible types
      tx.transaction!.data.transaction.transactions as unknown as IotaTransaction[];
    // @ts-expect-error -- Inference do not catch all possible types
    const _lastTransactionCall = _transactionsCall?.at(-1) as unknown as IotaTransaction;
    const _productEntryLoggedEvent = tx.events?.find((item) =>
      item.type.endsWith('ProductEntryLogged'),
    ) as unknown as IotaEvent;
    const status = tx.effects?.status.status;
    let isCallingLogEntry = false;

    // Determines if is calling `log_entry_data` function at `app` module
    if (_lastTransactionCall) {
      // @ts-expect-error -- Inference do not catch all possible types
      const moveCall = _lastTransactionCall.MoveCall as unknown as MoveCallIotaTransaction;
      isCallingLogEntry = moveCall?.module === 'app' && moveCall?.function === 'log_entry_data';
    }

    if (
      status !== 'success' ||
      _productEntryLoggedEvent == null ||
      _lastTransactionCall == null ||
      !isCallingLogEntry
    ) {
      // This element will be filtered out
      return {
        isCallingLogEntry,
      };
    }

    // @ts-expect-error -- Inference do not catch all possible types
    const entryId = _productEntryLoggedEvent.parsedJson?.entry_addr;
    // @ts-expect-error -- Inference do not catch all possible types
    const productId = _productEntryLoggedEvent.parsedJson?.product_addr;

    const _objectCreated = tx.effects?.created?.find(
      (item) => item.reference.objectId === entryId,
    ) as unknown as OwnedObjectRef;
    const version = _objectCreated.reference.version;
    const digest = _objectCreated.reference.digest;

    const txBlock = tx.digest;
    // @ts-expect-error -- Inference do not catch all possible types
    const _callInputs = tx.transaction?.data.transaction.inputs as unknown as IotaCallArg[];
    const serviceType = _callInputs.at(3).value.at(0);
    const serviceDescription = _callInputs.at(4).value.at(0);
    const healthScore = _callInputs.at(4).value.at(0);
    const findings = _callInputs.at(4).value.at(1);
    const issuerAddress = _productEntryLoggedEvent.sender;
    // @ts-expect-error -- Inference do not catch all possible types
    const issuerRole = _productEntryLoggedEvent.parsedJson?.issuer_role.variant.toLowerCase();
    const timestamp = tx.timestampMs;
    const packageId = _productEntryLoggedEvent.packageId;
    const rewardBalance =
      tx.balanceChanges?.find(findBalanceChangeByCoinType(packageId))?.amount || '0';

    return {
      productId,
      entryId,
      version,
      digest,
      txBlock,
      serviceType,
      serviceDescription,
      healthScore,
      findings,
      issuerAddress,
      issuerRole,
      timestamp,
      packageId,
      status,
      isCallingLogEntry,
      rewardBalance,
    } as ServiceEntry & { isCallingLogEntry: boolean };
  });

  // filter out transactions not calling `log_entry_data` and with no `success` effects
  // @ts-expect-error -- Inference is considering isCallingLogEntry, we can solve this by using Omit<>
  return transactionEntries.filter(
    (entry) =>
      entry.isCallingLogEntry &&
      // @ts-expect-error -- Inference is considering isCallingLogEntry, we can solve this by using Omit<>
      entry.status === 'success' &&
      // @ts-expect-error -- Inference is considering isCallingLogEntry, we can solve this by using Omit<>
      entry.productId === productIdToFilter,
  );
}

const findBalanceChangeByCoinType =
  (packageId: string) =>
  (value: BalanceChange): boolean => {
    return value.coinType === `${packageId}::LCC::LCC`;
  };

// Export all interfaces and functions
export { extractServiceTransactionData };
