/* eslint-disable @typescript-eslint/no-explicit-any -- TODO: Learn to use Iota types to replace any */
import { type IotaObjectData, type IotaObjectResponse } from "@iota/iota-sdk/client";

/*
Reward Vault Data Structure:
┌─────────────────────────────────────────────────────────────┐
│                     Reward Vault Object                     │
│ ID: 0xed269bb17177a70e020863a53fe1d0ff4e664a95dc305cd7...   │
├─────────────────────────────────────────────────────────────┤
│ Token Balances (VecMap<address, Coin<LCC>>)                 │
│ ┌─ Address 1 → LCC Balance                                  │
│ ├─ Address 2 → LCC Balance                                  │
│ └─ Address N → LCC Balance                                  │
├─────────────────────────────────────────────────────────────┤
│ LCC Token Distribution:                                     │
│ ┌─ Participant Address                                      │
│   ├─ Balance Amount (in smallest units)                     │
│   ├─ Coin Object ID                                         │
│   └─ Reward Eligibility Status                              │
└─────────────────────────────────────────────────────────────┘

Reward Hierarchy:
Vault (0xed269bb1...) → Address Balances → LCC Token Distribution

Reward Flow:
Ecosystem Activity → Accumulate Rewards → Vault Distribution → LCC Token Claims
*/

/**
 * Represents an LCC token balance for a specific address
 */
interface LCCBalance {
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
interface RewardVaultData {
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
 * Extracts and transforms reward vault data from IOTA Rebase JSON-RPC response
 * 
 * This function processes the vault's balance distribution system and creates
 * a frontend-friendly data structure with Maps for efficient balance lookups.
 * 
 * Process Flow:
 * ┌─ JSON Input ─┐    ┌─ Extract ─┐    ┌─ Transform ─┐    ┌─ Output ─┐
 * │ Vault Move   │ →  │ Metadata  │ →  │ Create Maps │ →  │ Clean    │
 * │ Object       │    │ Balances  │    │ Calc Totals │    │ Structure│
 * │              │    │ Addresses │    │             │    │          │
 * └──────────────┘    └───────────┘    └─────────────┘    └──────────┘
 * 
 * @param jsonData - The JSON-RPC response from iota_getObject call
 * @returns RewardVaultData object with extracted and organized information
 * 
 * @example
 * ```typescript
 * const response = await fetch('https://api.testnet.iota.cafe/', {
 *   method: 'POST',
 *   body: JSON.stringify({
 *     jsonrpc: "2.0",
 *     id: 1,
 *     method: "iota_getObject",
 *     params: ["0xed269bb1...", {"showContent": true}]
 *   })
 * });
 * const jsonData = await response.json();
 * const vaultData = extractRewardVaultData(jsonData);
 * console.log(`Loaded vault: ${vaultData.vaultId}`);
 * ```
 */
function extractRewardVaultData(jsonData: IotaObjectResponse): RewardVaultData {
  const data = jsonData.data as IotaObjectData;
  // TODO: Better understand the Iota types and make use of it
  const vault = data.content?.fields;
  let lccPackageId = "";
  let lccTypeName = "";

  // Extract Vault metadata
  const vaultId = data.objectId;
  const version = data.version;
  const digest = data.digest;

  // Extract balances from VecMap
  const balancesByAddress = new Map<string, LCCBalance>();
  let totalBalance = 0n;

  const balancesContents = vault.balances.fields.contents || [];

  balancesContents.forEach((entry: any) => {
    const address = entry.fields.key;
    const coinData = entry.fields.value.fields;
    const balance = coinData.balance;
    const balanceId = coinData.id.id;
    const coinType = entry.fields.value.type;

    // Extract coin definition and parse components
    const { packageId, module, typeName } = parseCoinDefinition(extractCoinDefinition(coinType));

    // Store package ID from first entry
    if (!lccPackageId) {
      lccPackageId = packageId;
      lccTypeName = typeName;
    }

    const lccBalance: LCCBalance = {
      address,
      balance,
      balanceId,
      packageId,
      module,
      typeName
    };

    balancesByAddress.set(address, lccBalance);
    totalBalance += BigInt(balance);
  });

  return {
    vaultId,
    version,
    digest,
    lccPackageId,
    lccTypeName,
    balancesByAddress,
    addressCount: balancesByAddress.size,
    totalBalance
  };
}

/**
 * Retrieves LCC balance for a specific address
 * 
 * Lookup Pattern:
 * Address → Map → LCC Balance Object
 * 
 * @param data - The reward vault data structure
 * @param address - The blockchain address to look up
 * @returns LCCBalance object for the address, or undefined if not found
 * 
 * @example
 * ```typescript
 * const balance = getBalanceByAddress(vaultData, '0x04c545450fa0b988...');
 * if (balance) {
 *   console.log(`Address has ${formatLCCBalance(balance)} LCC tokens`);
 * }
 * ```
 */
function getBalanceByAddress(data: RewardVaultData, address: string): LCCBalance | undefined {
  return data.balancesByAddress.get(address);
}

/**
 * Gets all addresses that have balances in the vault
 * 
 * @param data - The reward vault data structure
 * @returns Array of addresses with non-zero balances
 * 
 * @example
 * ```typescript
 * const addresses = getAllRewardAddresses(vaultData);
 * console.log(`${addresses.length} addresses have rewards`);
 * ```
 */
function getAllRewardAddresses(data: RewardVaultData): string[] {
  return Array.from(data.balancesByAddress.keys());
}

/**
 * Gets all LCC balances sorted by amount (highest first)
 * 
 * Sorting Pattern:
 * ┌─ All Balances ─┐    ┌─ Sort by Amount ─┐    ┌─ Ranked List ─┐
 * │ Addr1: 100 LCC │ →  │ Addr3: 500 LCC   │ →  │ Top Holders   │
 * │ Addr2: 300 LCC │    │ Addr2: 300 LCC   │    │ Distribution  │
 * │ Addr3: 500 LCC │    │ Addr1: 100 LCC   │    │               │
 * └────────────────┘    └──────────────────┘    └───────────────┘
 * 
 * @param data - The reward vault data structure
 * @returns Array of LCCBalance objects sorted by balance (descending)
 * 
 * @example
 * ```typescript
 * const topHolders = getBalancesSortedByAmount(vaultData);
 * console.log('Top 5 reward holders:');
 * topHolders.slice(0, 5).forEach((balance, index) => {
 *   console.log(`${index + 1}. ${balance.address}: ${formatLCCBalance(balance)} LCC`);
 * });
 * ```
 */
function getBalancesSortedByAmount(data: RewardVaultData): LCCBalance[] {
  return Array.from(data.balancesByAddress.values())
    .sort((a, b) => {
      const balanceA = BigInt(a.balance);
      const balanceB = BigInt(b.balance);
      return balanceA > balanceB ? -1 : balanceA < balanceB ? 1 : 0;
    });
}

/**
 * Checks if an address has any rewards in the vault
 * 
 * @param data - The reward vault data structure
 * @param address - The address to check
 * @returns true if address has rewards, false otherwise
 * 
 * @example
 * ```typescript
 * const hasRewards = addressHasRewards(vaultData, userAddress);
 * if (hasRewards) {
 *   const balance = getBalanceByAddress(vaultData, userAddress);
 *   showClaimRewardsButton(balance);
 * }
 * ```
 */
function addressHasRewards(data: RewardVaultData, address: string): boolean {
  const balance = data.balancesByAddress.get(address);
  return balance !== undefined && BigInt(balance.balance) > 0n;
}

/**
 * Calculates reward distribution statistics
 * 
 * Statistics Flow:
 * All Balances → Calculate Stats → Distribution Insights
 * 
 * @param data - The reward vault data structure
 * @returns Statistics object with distribution metrics
 * 
 * @example
 * ```typescript
 * const stats = getRewardDistributionStats(vaultData);
 * console.log(`Average reward: ${formatLCCBalance(stats.averageBalance)} LCC`);
 * console.log(`Median reward: ${formatLCCBalance(stats.medianBalance)} LCC`);
 * console.log(`Total distributed: ${formatLCCBalance(stats.totalDistributed)} LCC`);
 * ```
 */
function getRewardDistributionStats(data: RewardVaultData): {
  totalDistributed: string;
  averageBalance: string;
  medianBalance: string;
  addressCount: number;
} {
  const balances = Array.from(data.balancesByAddress.values());
  const sortedAmounts = balances
    .map(b => BigInt(b.balance))
    .sort((a, b) => a > b ? 1 : a < b ? -1 : 0);

  const totalDistributed = data.totalBalance.toString();
  const averageBalance = balances.length > 0
    ? (data.totalBalance / BigInt(balances.length)).toString()
    : "0";

  const medianIndex = Math.floor(sortedAmounts.length / 2);
  const medianBalance = sortedAmounts.length > 0
    ? sortedAmounts[medianIndex].toString()
    : "0";

  return {
    totalDistributed,
    averageBalance,
    medianBalance,
    addressCount: balances.length
  };
}

/**
 * Formats LCC balance from smallest units to human-readable format
 * 
 * Formatting Pattern:
 * "9999998000000000" → "9,999,998.000000000" LCC
 * 
 * @param balance - LCC balance in smallest units (string or LCCBalance object)
 * @returns Formatted balance string with proper decimals
 * 
 * @example
 * ```typescript
 * const formatted = formatLCCBalance("9999998000000000");
 * console.log(formatted); // "9,999,998.000000000"
 * 
 * const balance = getBalanceByAddress(vaultData, address);
 * console.log(`You have ${formatLCCBalance(balance)} LCC tokens`);
 * ```
 */
function formatLCCBalance(balance: string | LCCBalance): string {
  const balanceStr = typeof balance === 'string' ? balance : balance.balance;
  const balanceBigInt = BigInt(balanceStr);

  // LCC has 9 decimal places (like IOTA)
  const decimals = 9;
  const divisor = BigInt(10 ** decimals);

  const wholePart = balanceBigInt / divisor;
  // const fractionalPart = balanceBigInt % divisor;

  const wholeFormatted = wholePart.toLocaleString();
  // const fractionalFormatted = fractionalPart.toString().padStart(decimals, '0');

  // return `${wholeFormatted}.${fractionalFormatted}`;
  return `${wholeFormatted}`;
}

/**
 * Finds addresses with balances above a threshold
 * 
 * Filtering Pattern:
 * ┌─ Input: min amount ─┐
 * │                     │
 * ├─ Filter balances ───┤
 * │ Addr1: 100 LCC      │
 * │ Addr2: 500 LCC      │ ✓ Above threshold
 * │ Addr3: 50 LCC       │
 * │                     │
 * └─ Output: [Addr2] ───┘
 * 
 * @param data - The reward vault data structure
 * @param minBalance - Minimum balance threshold (in smallest units)
 * @returns Array of addresses with balances above threshold
 * 
 * @example
 * ```typescript
 * // Find addresses with more than 1 million LCC
 * const threshold = "1000000000000000"; // 1M LCC in smallest units
 * const whales = getAddressesAboveThreshold(vaultData, threshold);
 * console.log(`${whales.length} addresses have > 1M LCC rewards`);
 * ```
 */
function getAddressesAboveThreshold(data: RewardVaultData, minBalance: string): string[] {
  const threshold = BigInt(minBalance);
  const addresses: string[] = [];

  data.balancesByAddress.forEach((balance, address) => {
    if (BigInt(balance.balance) >= threshold) {
      addresses.push(address);
    }
  });

  return addresses;
}

/**
 * Checks if the vault is empty (no balances)
 * 
 * @param data - The reward vault data structure
 * @returns true if vault has no balances, false otherwise
 * 
 * @example
 * ```typescript
 * if (isVaultEmpty(vaultData)) {
 *   console.log('No rewards available for distribution');
 * }
 * ```
 */
function isVaultEmpty(data: RewardVaultData): boolean {
  return data.addressCount === 0;
}

/**
 * Gets the total value locked in the vault
 * 
 * @param data - The reward vault data structure
 * @returns Total LCC balance as formatted string
 * 
 * @example
 * ```typescript
 * const tvl = getVaultTotalValue(vaultData);
 * console.log(`Total Value Locked: ${tvl} LCC`);
 * ```
 */
function getVaultTotalValue(data: RewardVaultData): string {
  return formatLCCBalance(data.totalBalance.toString()) + ` ${data.lccTypeName}`;
}

/**
 * Extracts coin definition from Move coin type
 * 
 * Phase 1: Extract coin_definition from Coin<T>
 * "0x2::coin::Coin<PACKAGE::MODULE::TYPE>" → "PACKAGE::MODULE::TYPE"
 * 
 * @param coinType - The full Move coin type string
 * @returns The coin definition string (everything inside the angle brackets)
 * 
 * @example
 * ```typescript
 * const coinType = "0x2::coin::Coin<0x1d0b...::LCC::LCC>";
 * const definition = extractCoinDefinition(coinType);
 * console.log(definition); // "0x1d0b...::LCC::LCC"
 * ```
 */
function extractCoinDefinition(coinType: string): string {
  const match = coinType.match(/0x2::coin::Coin<(.+)>$/);
  return match?.[1] || "";
}

/**
 * Parses coin definition into components
 * 
 * Phase 2: Parse "PACKAGE::MODULE::TYPE"
 * "0x1d0b...::LCC::LCC" → { packageId, module, typeName }
 * 
 * Move Type Structure:
 * ┌─ Package ID ─┐  ┌─ Module ─┐  ┌─ Type ─┐
 * │ 0x1d0b1bdb... │  │   LCC    │  │  LCC  │
 * └───────────────┘  └──────────┘  └───────┘
 *        │                │           │
 *        │                │           └─ Struct/Type Name
 *        │                └─ Module Name within Package
 *        └─ Smart Contract Address
 * 
 * @param coinDefinition - The coin definition string (PACKAGE::MODULE::TYPE)
 * @returns Object with parsed components
 * 
 * @example
 * ```typescript
 * const definition = "0x1d0b1bdb1b5ff25102e2e9d3858f898cd6c9f016b87b496c2e041f0ac060c5e7::LCC::LCC";
 * const parsed = parseCoinDefinition(definition);
 * console.log(parsed.packageId); // "0x1d0b1bdb..."
 * console.log(parsed.module);    // "LCC"
 * console.log(parsed.typeName);  // "LCC"
 * ```
 */
function parseCoinDefinition(coinDefinition: string): {
  packageId: string;
  module: string;
  typeName: string;
} {
  const parts = coinDefinition.split('::');

  return {
    packageId: parts[0] || "",      // "0x1d0b1bdb..."
    module: parts[1] || "",         // "LCC" 
    typeName: parts[2] || ""        // "LCC"
  };
}

/**
 * Gets the LCC token package ID from the vault
 * 
 * @param data - The reward vault data structure
 * @returns The LCC token package/contract address
 * 
 * @example
 * ```typescript
 * const packageId = getLCCPackageId(vaultData);
 * console.log(`LCC Token Contract: ${packageId}`);
 * // Output: "0x1d0b1bdb1b5ff25102e2e9d3858f898cd6c9f016b87b496c2e041f0ac060c5e7"
 * ```
 */
function getLCCPackageId(data: RewardVaultData): string {
  return data.lccPackageId;
}

// Export all interfaces and functions
export {
  type LCCBalance,
  type RewardVaultData,
  extractRewardVaultData,
  getBalanceByAddress,
  getAllRewardAddresses,
  getBalancesSortedByAmount,
  addressHasRewards,
  getRewardDistributionStats,
  formatLCCBalance,
  getAddressesAboveThreshold,
  isVaultEmpty,
  getVaultTotalValue,
  extractCoinDefinition,
  parseCoinDefinition,
  getLCCPackageId
};

// Usage example with complete workflow:
/*
┌─────────────────────────────────────────────────────────────┐
│                    Usage Workflow                           │
├─────────────────────────────────────────────────────────────┤
│ 1. Fetch vault data from blockchain                         │
│ 2. Extract reward vault structure                           │
│ 3. Query balance information                                │
│ 4. Display in rewards UI                                    │
└─────────────────────────────────────────────────────────────┘

const vaultData = extractRewardVaultData(jsonResponse);

// Dashboard: Show vault overview
console.log(`Vault ID: ${vaultData.vaultId}`);
console.log(`Total Value Locked: ${getVaultTotalValue(vaultData)} LCC`);
console.log(`Reward recipients: ${vaultData.addressCount}`);

// User Profile: Show user's rewards
const userBalance = getBalanceByAddress(vaultData, currentUserAddress);
if (userBalance) {
  console.log(`Your rewards: ${formatLCCBalance(userBalance)} LCC`);
  console.log(`Claim from coin: ${userBalance.coinId}`);
}

// Analytics: Distribution insights
const stats = getRewardDistributionStats(vaultData);
console.log(`Average reward: ${formatLCCBalance(stats.averageBalance)} LCC`);

// Leaderboard: Top reward holders
const topHolders = getBalancesSortedByAmount(vaultData);
console.log('Top 10 reward holders:');
topHolders.slice(0, 10).forEach((balance, index) => {
  console.log(`${index + 1}. ${balance.address}: ${formatLCCBalance(balance)} LCC`);
});

// Governance: High-value stakeholders
const whales = getAddressesAboveThreshold(vaultData, "1000000000000000"); // 1M LCC
console.log(`${whales.length} addresses hold > 1M LCC rewards`);

// UI State: Check if user has claimable rewards
const hasClaimableRewards = addressHasRewards(vaultData, userAddress);
if (hasClaimableRewards) {
  showClaimButton(getBalanceByAddress(vaultData, userAddress));
}
*/
