/* eslint-disable @typescript-eslint/no-explicit-any -- TODO: Learn to use Iota types to replace any */
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

/**
 * Represents a product entry logging event that triggers rewards
 */
interface ProductEntryEvent {
  /** The transaction digest containing this event */
  txDigest: string;
  /** The event sequence number within the transaction */
  eventSeq: string;
  /** The smart contract package that emitted this event */
  packageId: string;
  /** The sender/issuer of this product entry */
  sender: string;
  /** The product entry address created */
  entryAddr: string;
  /** The product address this entry belongs to */
  productAddr: string;
  /** The role of the issuer (Repairer, Manufacturer, etc.) */
  issuerRole: {
    variant: string;
    fields: Record<string, any>;
  };
  /** Timestamp when this event occurred */
  timestamp: string;
  /** The blockchain checkpoint this event was recorded in */
  checkpoint: string;
}

/**
 * Represents an LCC token balance change (reward grant)
 */
interface RewardBalanceChange {
  /** The recipient address of the reward */
  owner: string;
  /** The LCC token type identifier */
  coinType: string;
  /** The reward amount (positive = received, negative = spent) */
  amount: string;
  /** The transaction digest containing this balance change */
  txDigest: string;
  /** Timestamp when this balance change occurred */
  timestamp: string;
  /** The blockchain checkpoint this change was recorded in */
  checkpoint: string;
}

/**
 * Represents a complete reward transaction with all related data
 */
interface RewardTransaction {
  /** Unique transaction identifier */
  digest: string;
  /** Transaction execution status */
  status: string;
  /** The blockchain epoch when this transaction was executed */
  executedEpoch: string;
  /** Product entry events in this transaction */
  productEntries: ProductEntryEvent[];
  /** LCC reward balance changes in this transaction */
  rewardChanges: RewardBalanceChange[];
  /** Timestamp when this transaction occurred */
  timestamp: string;
  /** The blockchain checkpoint this transaction was recorded in */
  checkpoint: string;
}

/**
 * Complete reward vault transaction history data structure
 * 
 * Usage Example:
 * ```typescript
 * const txData = extractRewardTransactionData(jsonResponse);
 * 
 * // Show transaction overview
 * console.log(`Found ${txData.transactionCount} reward transactions`);
 * console.log(`Total LCC distributed: ${txData.totalLCCDistributed} tokens`);
 * 
 * // Get recent activity
 * const recent = getRecentRewardActivity(txData, 7); // last 7 days
 * console.log(`Recent rewards: ${recent.length} transactions`);
 * ```
 */
interface RewardVaultTransactionData {
  /** Total number of transactions found */
  transactionCount: number;
  /** All reward transactions sorted by timestamp (newest first) */
  transactions: RewardTransaction[];
  /** Map of transaction digest to transaction for O(1) lookup */
  transactionsByDigest: Map<string, RewardTransaction>;
  /** Map of recipient address to their reward transactions */
  transactionsByRecipient: Map<string, RewardTransaction[]>;
  /** Map of product address to related transactions */
  transactionsByProduct: Map<string, RewardTransaction[]>;
  /** Map of issuer role to related transactions */
  transactionsByRole: Map<string, RewardTransaction[]>;
  /** Total LCC tokens distributed across all transactions */
  totalLCCDistributed: bigint;
  /** Date range of transaction data */
  dateRange: {
    earliest: Date;
    latest: Date;
  };
}

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
function extractRewardTransactionData(jsonData: any[], productIdToFilter: string): RewardVaultTransactionData {
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
    const status = txData.effects?.status?.status || "unknown";
    const executedEpoch = txData.effects?.executedEpoch || "0";
    const timestamp = txData.timestampMs;
    const checkpoint = txData.checkpoint;

    const txTimestamp = new Date(parseInt(timestamp));
    if (txTimestamp < earliestTimestamp) earliestTimestamp = txTimestamp;
    if (txTimestamp > latestTimestamp) latestTimestamp = txTimestamp;

    // Extract product entry events
    const productEntries: ProductEntryEvent[] = [];
    const events = txData.events || [];

    const productsSeen = new Set();
    events.forEach((event: any) => {
      if (event.type?.includes("::app::ProductEntryLogged")) {
        const productEntry: ProductEntryEvent = {
          txDigest: digest,
          eventSeq: event.id.eventSeq,
          packageId: event.packageId,
          sender: event.sender,
          entryAddr: event.parsedJson.entry_addr,
          productAddr: event.parsedJson.product_addr,
          issuerRole: event.parsedJson.issuer_role,
          timestamp,
          checkpoint
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

    balanceChanges.forEach((change: any) => {
      if (change.coinType?.includes("::LCC::LCC")) {
        const owner = change.owner?.AddressOwner;
        if (owner) {
          const rewardChange: RewardBalanceChange = {
            owner,
            coinType: change.coinType,
            amount: change.amount,
            txDigest: digest,
            timestamp,
            checkpoint
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
      checkpoint
    };

    transactions.push(transaction);
    transactionsByDigest.set(digest, transaction);

    // Index by recipient
    rewardChanges.forEach(change => {
      if (!transactionsByRecipient.has(change.owner)) {
        transactionsByRecipient.set(change.owner, []);
      }
      transactionsByRecipient.get(change.owner)!.push(transaction);
    });

    // Index by product
    productEntries.forEach(entry => {
      if (!transactionsByProduct.has(entry.productAddr)) {
        transactionsByProduct.set(entry.productAddr, []);
      }
      transactionsByProduct.get(entry.productAddr)!.push(transaction);
    });

    // Index by issuer role
    productEntries.forEach(entry => {
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
      latest: latestTimestamp
    }
  };
}

/**
 * Gets reward transactions for a specific address
 * 
 * Lookup Pattern:
 * Address → Map → Transaction Array
 * 
 * @param data - The reward transaction data structure
 * @param address - The address to look up
 * @returns Array of transactions where this address received rewards
 * 
 * @example
 * ```typescript
 * const userTxs = getTransactionsByAddress(txData, '0x04c545450fa0b988...');
 * console.log(`User has ${userTxs.length} reward transactions`);
 * userTxs.forEach(tx => {
 *   const rewards = tx.rewardChanges.filter(c => c.owner === address);
 *   rewards.forEach(reward => {
 *     console.log(`Received ${formatLCCAmount(reward.amount)} LCC`);
 *   });
 * });
 * ```
 */
function getTransactionsByAddress(data: RewardVaultTransactionData, address: string): RewardTransaction[] {
  return data.transactionsByRecipient.get(address) || [];
}

/**
 * Gets reward transactions related to a specific product
 * 
 * @param data - The reward transaction data structure
 * @param productAddr - The product address to look up
 * @returns Array of transactions related to this product
 * 
 * @example
 * ```typescript
 * const productTxs = getTransactionsByProduct(txData, '0x04c545450fa0b988...');
 * console.log(`Product has ${productTxs.length} related transactions`);
 * ```
 */
function getTransactionsByProduct(data: RewardVaultTransactionData, productAddr: string): RewardTransaction[] {
  return data.transactionsByProduct.get(productAddr) || [];
}

/**
 * Gets reward transactions by issuer role
 * 
 * Role Analysis Pattern:
 * ┌─ Input: "Repairer" ─┐
 * │                     │
 * ├─ Filter by role ────┤
 * │ TX1: Manufacturer   │
 * │ TX2: Repairer       │ ✓ Match
 * │ TX3: Repairer       │ ✓ Match
 * │                     │
 * └─ Output: [TX2,TX3] ─┘
 * 
 * @param data - The reward transaction data structure
 * @param role - The issuer role to filter by
 * @returns Array of transactions from issuers with this role
 * 
 * @example
 * ```typescript
 * const repairerTxs = getTransactionsByRole(txData, 'Repairer');
 * console.log(`${repairerTxs.length} transactions by repairers`);
 * 
 * const allRoles = getAllIssuerRoles(txData);
 * allRoles.forEach(role => {
 *   const roleTxs = getTransactionsByRole(txData, role);
 *   console.log(`${role}: ${roleTxs.length} transactions`);
 * });
 * ```
 */
function getTransactionsByRole(data: RewardVaultTransactionData, role: string): RewardTransaction[] {
  return data.transactionsByRole.get(role) || [];
}

/**
 * Gets recent reward activity within a specified number of days
 * 
 * Temporal Filtering:
 * Now - N days → Filter Transactions → Recent Activity Array
 * 
 * @param data - The reward transaction data structure
 * @param days - Number of days to look back from now
 * @returns Array of transactions within the specified time period
 * 
 * @example
 * ```typescript
 * const lastWeek = getRecentRewardActivity(txData, 7);
 * console.log(`${lastWeek.length} transactions in last 7 days`);
 * 
 * const today = getRecentRewardActivity(txData, 1);
 * console.log(`${today.length} transactions today`);
 * ```
 */
function getRecentRewardActivity(data: RewardVaultTransactionData, days: number): RewardTransaction[] {
  const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);
  return data.transactions.filter(tx => parseInt(tx.timestamp) >= cutoffTime);
}

/**
 * Gets all unique recipient addresses from reward transactions
 * 
 * @param data - The reward transaction data structure
 * @returns Array of unique addresses that have received rewards
 * 
 * @example
 * ```typescript
 * const recipients = getAllRewardRecipients(txData);
 * console.log(`${recipients.length} unique addresses received rewards`);
 * ```
 */
function getAllRewardRecipients(data: RewardVaultTransactionData): string[] {
  return Array.from(data.transactionsByRecipient.keys());
}

/**
 * Gets all unique issuer roles from product entry events
 * 
 * @param data - The reward transaction data structure
 * @returns Array of unique issuer roles
 * 
 * @example
 * ```typescript
 * const roles = getAllIssuerRoles(txData);
 * console.log('Available roles:', roles); // ["Repairer", "Manufacturer", ...]
 * ```
 */
function getAllIssuerRoles(data: RewardVaultTransactionData): string[] {
  return Array.from(data.transactionsByRole.keys());
}

/**
 * Gets all unique product addresses from transaction history
 * 
 * @param data - The reward transaction data structure
 * @returns Array of unique product addresses
 * 
 * @example
 * ```typescript
 * const products = getAllProductAddresses(txData);
 * console.log(`${products.length} unique products have reward activity`);
 * ```
 */
function getAllProductAddresses(data: RewardVaultTransactionData): string[] {
  return Array.from(data.transactionsByProduct.keys());
}

/**
 * Calculates reward statistics and distribution metrics
 * 
 * Statistics Flow:
 * All Transactions → Extract Rewards → Calculate Distribution → Metrics
 * 
 * @param data - The reward transaction data structure
 * @returns Statistics object with reward distribution insights
 * 
 * @example
 * ```typescript
 * const stats = getRewardDistributionStats(txData);
 * console.log(`Total distributed: ${formatLCCAmount(stats.totalDistributed)} LCC`);
 * console.log(`Average per tx: ${formatLCCAmount(stats.averagePerTransaction)} LCC`);
 * console.log(`Top recipient: ${stats.topRecipient.address} (${formatLCCAmount(stats.topRecipient.total)} LCC)`);
 * ```
 */
function getRewardDistributionStats(data: RewardVaultTransactionData): {
  totalDistributed: string;
  averagePerTransaction: string;
  averagePerRecipient: string;
  transactionCount: number;
  recipientCount: number;
  topRecipient: { address: string; total: string; transactionCount: number };
  topProduct: { address: string; transactionCount: number };
  mostActiveRole: { role: string; transactionCount: number };
} {
  const recipients = data.transactionsByRecipient;
  const products = data.transactionsByProduct;
  const roles = data.transactionsByRole;

  // Calculate recipient totals
  const recipientTotals = new Map<string, bigint>();
  recipients.forEach((txs, address) => {
    let total = 0n;
    txs.forEach(tx => {
      tx.rewardChanges.forEach(change => {
        if (change.owner === address && BigInt(change.amount) > 0n) {
          total += BigInt(change.amount);
        }
      });
    });
    recipientTotals.set(address, total);
  });

  // Find top recipient
  let topRecipientAddr = "";
  let topRecipientTotal = 0n;
  recipientTotals.forEach((total, address) => {
    if (total > topRecipientTotal) {
      topRecipientTotal = total;
      topRecipientAddr = address;
    }
  });

  // Find most active product
  let topProductAddr = "";
  let topProductTxCount = 0;
  products.forEach((txs, address) => {
    if (txs.length > topProductTxCount) {
      topProductTxCount = txs.length;
      topProductAddr = address;
    }
  });

  // Find most active role
  let mostActiveRole = "";
  let mostActiveRoleCount = 0;
  roles.forEach((txs, role) => {
    if (txs.length > mostActiveRoleCount) {
      mostActiveRoleCount = txs.length;
      mostActiveRole = role;
    }
  });

  const totalDistributed = data.totalLCCDistributed.toString();
  const averagePerTransaction = data.transactionCount > 0
    ? (data.totalLCCDistributed / BigInt(data.transactionCount)).toString()
    : "0";
  const averagePerRecipient = recipients.size > 0
    ? (data.totalLCCDistributed / BigInt(recipients.size)).toString()
    : "0";

  return {
    totalDistributed,
    averagePerTransaction,
    averagePerRecipient,
    transactionCount: data.transactionCount,
    recipientCount: recipients.size,
    topRecipient: {
      address: topRecipientAddr,
      total: topRecipientTotal.toString(),
      transactionCount: recipients.get(topRecipientAddr)?.length || 0
    },
    topProduct: {
      address: topProductAddr,
      transactionCount: topProductTxCount
    },
    mostActiveRole: {
      role: mostActiveRole,
      transactionCount: mostActiveRoleCount
    }
  };
}

/**
 * Formats LCC amount from smallest units to human-readable format
 * 
 * Formatting Pattern:
 * "1000000000" → "1.000000000" LCC → "1" LCC (simplified)
 * 
 * @param amount - LCC amount in smallest units (string)
 * @returns Formatted amount string
 * 
 * @example
 * ```typescript
 * const formatted = formatLCCAmount("1000000000");
 * console.log(formatted); // "1"
 * 
 * const change = tx.rewardChanges[0];
 * console.log(`Received ${formatLCCAmount(change.amount)} LCC`);
 * ```
 */
function formatLCCAmount(amount: string): string {
  const amountBigInt = BigInt(amount);

  // LCC has 9 decimal places (like IOTA)
  const decimals = 9;
  const divisor = BigInt(10 ** decimals);

  const wholePart = amountBigInt / divisor;
  return wholePart.toLocaleString();
}

/**
 * Gets transaction by digest
 * 
 * @param data - The reward transaction data structure
 * @param digest - The transaction digest to look up
 * @returns Transaction object or undefined if not found
 * 
 * @example
 * ```typescript
 * const tx = getTransactionByDigest(txData, '4GiwrpLk3BvhnWeJ6c7cV21y6czfADbAhQ6bw7gZidWE');
 * if (tx) {
 *   console.log(`Transaction status: ${tx.status}`);
 *   console.log(`Product entries: ${tx.productEntries.length}`);
 *   console.log(`Reward changes: ${tx.rewardChanges.length}`);
 * }
 * ```
 */
function getTransactionByDigest(data: RewardVaultTransactionData, digest: string): RewardTransaction | undefined {
  return data.transactionsByDigest.get(digest);
}

/**
 * Checks if there are any recent reward transactions
 * 
 * @param data - The reward transaction data structure
 * @param hours - Number of hours to check back from now
 * @returns true if there are transactions within the timeframe
 * 
 * @example
 * ```typescript
 * const hasRecentActivity = hasRecentRewardActivity(txData, 24);
 * if (hasRecentActivity) {
 *   console.log('Reward system is active!');
 * }
 * ```
 */
function hasRecentRewardActivity(data: RewardVaultTransactionData, hours: number): boolean {
  const cutoffTime = Date.now() - (hours * 60 * 60 * 1000);
  return data.transactions.some(tx => parseInt(tx.timestamp) >= cutoffTime);
}

// Export all interfaces and functions
export {
  type ProductEntryEvent,
  type RewardBalanceChange,
  type RewardTransaction,
  type RewardVaultTransactionData,
  extractRewardTransactionData,
  getTransactionsByAddress,
  getTransactionsByProduct,
  getTransactionsByRole,
  getRecentRewardActivity,
  getAllRewardRecipients,
  getAllIssuerRoles,
  getAllProductAddresses,
  getRewardDistributionStats,
  formatLCCAmount,
  getTransactionByDigest,
  hasRecentRewardActivity
};
