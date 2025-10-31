
/**
 * Represents an LCC token balance for a specific address
 */
export interface LCCBalance {
  /** The blockchain address that owns this balance */
  address: string;
  /** The balance amount in smallest LCC units (wei-like) */
  balance: string;
  /** The unique object ID for this balance */
  balanceId: string;
  /** The LCC token package ID (smart contract address) */
  packageId: string;
  /** The module name within the package (e.g., "LCC") */
  module: string;
  /** The type name within the module (e.g., "LCC") */
  typeName: string;
}

/**
 * Complete reward vault data structure containing all token distribution information
 *
 * Usage Example:
 * ```typescript
 * const vault = extractRewardVaultData(jsonResponse);
 *
 * // Check vault capacity
 * console.log(`Vault ID: ${vault.vaultId}`);
 * console.log(`Total addresses: ${vault.addressCount}`);
 *
 * // Get specific balance
 * const balance = getBalanceByAddress(vault, '0x04c545450fa0b988...');
 * console.log(`Balance: ${formatLCCBalance(balance)} LCC`);
 * ```
 */
export interface RewardVaultData {
  /** The unique blockchain object ID of this reward vault */
  vaultId: string;
  /** The version number of this vault state */
  version: string;
  /** The cryptographic digest/hash of this vault state */
  digest: string;
  /** The LCC token package ID (smart contract address) */
  lccPackageId: string;
  /** The LCC token name */
  lccTypeName: string;
  /** Map of address to their LCC balance for O(1) lookup */
  balancesByAddress: Map<string, LCCBalance>;
  /** Total number of addresses with balances */
  addressCount: number;
  /** Total LCC tokens held in the vault across all addresses */
  totalBalance: bigint;
}

/**
 * Represents a product entry logging event that triggers rewards
 */
export interface ProductEntryEvent {
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
    fields: Record<string, unknown>;
  };
  /** Timestamp when this event occurred */
  timestamp: string;
  /** The blockchain checkpoint this event was recorded in */
  checkpoint: string;
}

/**
 * Represents an LCC token balance change (reward grant)
 */
export interface RewardBalanceChange {
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
export interface RewardTransaction {
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
export interface RewardVaultTransactionData {
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
