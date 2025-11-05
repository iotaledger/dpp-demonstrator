import { LCCBalance, RewardVaultData } from '@/types/reward';
import { type IotaObjectData, type IotaObjectResponse } from '@iota/iota-sdk/client';

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
│ ├─ Balance Amount (in smallest units)                       │
│ ├─ Coin Object ID                                           │
│ └─ Reward Eligibility Status                                │
└─────────────────────────────────────────────────────────────┘

Reward Hierarchy:
Vault (0xed269bb1...) → Address Balances → LCC Token Distribution

Reward Flow:
Ecosystem Activity → Accumulate Rewards → Vault Distribution → LCC Token Claims
*/


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
  // @ts-expect-error - turn off parsing noise
  const vault = data.content?.fields;
  let lccPackageId = '';
  let lccTypeName = '';

  // Extract Vault metadata
  const vaultId = data.objectId;
  const version = data.version;
  const digest = data.digest;

  // Extract balances from VecMap
  const balancesByAddress = new Map<string, LCCBalance>();
  let totalBalance = 0n;

  const balancesContents = vault.balances.fields.contents || [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- turn off parsing noise
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
      typeName,
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
    totalBalance,
  };
}

function extractRewardTotalSuply(jsonData: IotaObjectResponse): string | undefined {
  // @ts-expect-error -- turn off parsing noise
  const total_supply = jsonData.data?.content?.fields?.total_supply;
  return total_supply?.fields?.value;
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
function getVaultTotalValuePerAddress(data: RewardVaultData, address: string): string {
  let amount = '0';
  if (data.balancesByAddress.has(address)) {
    amount = formatLCCBalance(data.balancesByAddress.get(address)!.balance);
  }
  return amount + ` ${data.lccTypeName}`;
}

function getVaultRewardBalancePerAddress(data: RewardVaultData, address: string): string {
  if (data.balancesByAddress.has(address)) {
    return data.balancesByAddress.get(address)!.balance;
  }
  return '0';
}

function getVaultTotalSupply(totalSupply: string, data: RewardVaultData): string {
  return formatLCCBalance(totalSupply) + `${data.lccTypeName}`;
}

function getVaultRewardUsagePercentage(totalSupply: string, remainingSupply: string): string {
  const totalSupplyValue = Number.parseInt(totalSupply);
  const remainingSupplyValue = Number.parseInt(remainingSupply);
  const usedSupplyValue = totalSupplyValue - remainingSupplyValue;
  const ratio = 100 * usedSupplyValue / totalSupplyValue;
  if (ratio < 0.0001) {
    return '<0.0001%'
  } else if (ratio < 0.001) {
    return '<0.001%'
  } else if (ratio < 0.01) {
    return '<0.01%'
  } else if (ratio < 0.1) {
    return '<0.1%'
  } else if (ratio < 1) {
    return '<1%'
  } else {
    return Math.floor(ratio) + '%';
  }
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
  return match?.[1] || '';
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
    packageId: parts[0] || '', // "0x1d0b1bdb..."
    module: parts[1] || '', // "LCC"
    typeName: parts[2] || '', // "LCC"
  };
}

export {
  extractRewardVaultData,
  extractRewardTotalSuply,
  formatLCCBalance,
  getVaultTotalValuePerAddress,
  getVaultTotalSupply,
  getVaultRewardUsagePercentage,
  getVaultRewardBalancePerAddress,
  extractCoinDefinition,
  parseCoinDefinition,
};
