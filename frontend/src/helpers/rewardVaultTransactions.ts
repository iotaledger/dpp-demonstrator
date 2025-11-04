/*
Reward Vault Transactions Data Structure:
┌─────────────────────────────────────────────────────────────┐
│                 Transaction Query Result                    │
│ Query: InputObject 0xed269bb17177a70e020863a53fe1d0ff...    │
├─────────────────────────────────────────────────────────────┤
│ Transaction Array                                           │
│ ┌─ Transaction 1 (digest: 4GiwrpLk...)                      │
│ │  ├─ Events: ProductEntryLogged                            │
│ │  ├─ Balance Changes: LCC rewards (+1B units)              │
│ │  ├─ Gas Usage & Effects                                   │
│ │  └─ Timestamp & Checkpoint                                │
│ ├─ Transaction 2 (digest: 9mzBow9D...)                      │
│ └─ Transaction N...                                         │
├─────────────────────────────────────────────────────────────┤
│ Reward Distribution Patterns:                               │
│ ┌─ Product Entry → LCC Reward Grant                         │
│ ├─ Issuer Role (Repairer, etc.) → Reward Amount             │
│ ├─ Gas Costs (IOTA) ↔ LCC Rewards                           │
│ └─ Temporal Distribution (Timestamp-based)                  │
└─────────────────────────────────────────────────────────────┘

Reward Transaction Hierarchy:
QueryResult → TransactionArray → Transaction → Events + BalanceChanges → RewardGrants

Reward Flow:
Product Activity → Issue Entry Log → LCC Token Grant → Balance Update → Vault State Change
*/

import { ProductEntryEvent, RewardBalanceChange, RewardTransaction, RewardVaultTransactionData } from "@/types/reward";

/**
 * Extracts and transforms reward vault transaction data from IOTA Rebase JSON-RPC response
 *
 * This function processes transaction query results for a reward vault and creates
 * a frontend-friendly data structure with Maps for efficient lookups and analysis.
 *
 * Process Flow:
 * ┌─ JSON Input ─┐    ┌─ Extract ─┐    ┌─ Transform ─┐    ┌─ Output ─┐
 * │ TX Query     │ →  │ Events    │ →  │ Create Maps │ →  │ Clean    │
 * │ Response     │    │ Changes   │    │ Calc Totals │    │ Structure│
 * │              │    │ Metadata  │    │             │    │          │
 * └──────────────┘    └───────────┘    └─────────────┘    └──────────┘
 *
 * @param jsonData - The JSON-RPC response from iotax_queryTransactionBlocks
 * @returns RewardVaultTransactionData object with extracted and organized information
 *
 * @example
 * ```typescript
 * const response = await fetch('https://api.testnet.iota.cafe/', {
 *   method: 'POST',
 *   body: JSON.stringify({
 *     jsonrpc: "2.0",
 *     id: 15,
 *     method: "iotax_queryTransactionBlocks",
 *     params: [{
 *       filter: { InputObject: "0xed269bb17177a70e020863a53fe1d0ff4e664a95dc305cd7531dfe5efbc8386c" },
 *       options: { showBalanceChanges: true, showEffects: true, showEvents: true }
 *     }, null, 20, true]
 *   })
 * });
 * const jsonData = await response.json();
 * const txData = extractRewardTransactionData(jsonData);
 * console.log(`Loaded ${txData.transactionCount} reward transactions`);
 * ```
 */
function extractRewardTransactionData(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- turn off parsing noise
  jsonData: any[],
  productIdToFilter: string,
): RewardVaultTransactionData {
  const transactions: RewardTransaction[] = [];
  const transactionsByDigest = new Map<string, RewardTransaction>();
  const transactionsByRecipient = new Map<string, RewardTransaction[]>();
  const transactionsByProduct = new Map<string, RewardTransaction[]>();
  const transactionsByRole = new Map<string, RewardTransaction[]>();
  let totalLCCDistributed = 0n;
  let earliestTimestamp = new Date();
  let latestTimestamp = new Date(0);

  // Process each transaction
  const txArray = jsonData || [];

  for (const txData of txArray) {
    const digest = txData.digest;
    const status = txData.effects?.status?.status || 'unknown';
    const executedEpoch = txData.effects?.executedEpoch || '0';
    const timestamp = txData.timestampMs;
    const checkpoint = txData.checkpoint;

    const txTimestamp = new Date(parseInt(timestamp));
    if (txTimestamp < earliestTimestamp) earliestTimestamp = txTimestamp;
    if (txTimestamp > latestTimestamp) latestTimestamp = txTimestamp;

    // Extract product entry events
    const productEntries: ProductEntryEvent[] = [];
    const events = txData.events || [];

    const productsSeen = new Set();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- turn off parsing noise
    events.forEach((event: any) => {
      if (event.type?.includes('::app::ProductEntryLogged')) {
        const productEntry: ProductEntryEvent = {
          txDigest: digest,
          eventSeq: event.id.eventSeq,
          packageId: event.packageId,
          sender: event.sender,
          entryAddr: event.parsedJson.entry_addr,
          productAddr: event.parsedJson.product_addr,
          issuerRole: event.parsedJson.issuer_role,
          timestamp,
          checkpoint,
        };
        productsSeen.add(productEntry.productAddr);
        productEntries.push(productEntry);
      }
    });

    // Filters out transactions not related to product ID
    if (!productsSeen.has(productIdToFilter)) {
      continue;
    }

    // Extract LCC reward balance changes
    const rewardChanges: RewardBalanceChange[] = [];
    const balanceChanges = txData.balanceChanges || [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- turn off parsing noise
    balanceChanges.forEach((change: any) => {
      if (change.coinType?.includes('::LCC::LCC')) {
        const owner = change.owner?.AddressOwner;
        if (owner) {
          const rewardChange: RewardBalanceChange = {
            owner,
            coinType: change.coinType,
            amount: change.amount,
            txDigest: digest,
            timestamp,
            checkpoint,
          };
          rewardChanges.push(rewardChange);

          // Track LCC distribution (only positive amounts)
          const amount = BigInt(change.amount);
          if (amount > 0n) {
            totalLCCDistributed += amount;
          }
        }
      }
    });

    // Create complete transaction record
    const transaction: RewardTransaction = {
      digest,
      status,
      executedEpoch,
      productEntries,
      rewardChanges,
      timestamp,
      checkpoint,
    };

    transactions.push(transaction);
    transactionsByDigest.set(digest, transaction);

    // Index by recipient
    rewardChanges.forEach((change) => {
      if (!transactionsByRecipient.has(change.owner)) {
        transactionsByRecipient.set(change.owner, []);
      }
      transactionsByRecipient.get(change.owner)!.push(transaction);
    });

    // Index by product
    productEntries.forEach((entry) => {
      if (!transactionsByProduct.has(entry.productAddr)) {
        transactionsByProduct.set(entry.productAddr, []);
      }
      transactionsByProduct.get(entry.productAddr)!.push(transaction);
    });

    // Index by issuer role
    productEntries.forEach((entry) => {
      const role = entry.issuerRole.variant;
      if (!transactionsByRole.has(role)) {
        transactionsByRole.set(role, []);
      }
      transactionsByRole.get(role)!.push(transaction);
    });
  }

  // Sort transactions by timestamp (newest first)
  transactions.sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp));

  return {
    transactionCount: transactions.length,
    transactions,
    transactionsByDigest,
    transactionsByRecipient,
    transactionsByProduct,
    transactionsByRole,
    totalLCCDistributed,
    dateRange: {
      earliest: earliestTimestamp,
      latest: latestTimestamp,
    },
  };
}

// Export all interfaces and functions
export {
  extractRewardTransactionData,
};
