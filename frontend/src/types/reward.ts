
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
