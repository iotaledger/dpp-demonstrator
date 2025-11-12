/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

import { EXPLORER_URL, NETWORK } from './constants';

/**
 * Checks if `value`is an empty string.
 *
 * @param {string} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an empty string, `false` otherwise.
 */
export function isStringEmpty(value: string): boolean {
  if (!isString(value)) {
    throw new Error('The `value` property must be a string.');
  }

  return value.trim() === '';
}

/**
 * Checks if `value` is classified as a `String` primitive.
 *
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a string, `false` otherwise.
 */
export function isString(value: unknown): boolean {
  return typeof value === 'string';
}

/**
 * Convert a timestamp value either in `string` or `number` to formatted date as YYYY-MM-DD HH:mm:ss.
 *
 * @param {string|number|undefined} timestampMs The timestamp in milliseconds.
 * @returns {string} Returns a `string` representing the timestamp in the following date format: YYYY-MM-DD HH:mm:ss.
 */
export function fromPosixMsToUtcDateFormat(timestampMs: string | number | undefined): string {
  if (timestampMs == null) {
    return '';
  }

  const ts = typeof timestampMs === 'string' ? parseInt(timestampMs, 10) : timestampMs;
  const date = new Date(ts);

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function firstLetterUpperCase(value: string) {
  if (!isString(value)) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function truncateAddress(address?: string | null, numOfCharacters = 4) {
  if (address == null) return '';

  const firstPart = address.substring(0, numOfCharacters + 1);
  const secondPart = address.substring(address?.length - numOfCharacters);

  return `${firstPart}...${secondPart}`;
}

export function generateRequestId(): string {
  return crypto.randomUUID();
}

/**
 * Formats LCC balance from smallest units to human-readable format, only the whole part.
 *
 * Formatting Pattern:
 * "9999998000000000" → "9,999,998" LCC
 *
 * @param balanceStr - LCC balance in smallest units (string or LCCBalance object)
 * @returns Formatted balance string without decimals
 *
 * @example
 * ```typescript
 * const formatted = formatLCCBalance("9999998000000000");
 * console.log(formatted); // "9,999,998"
 *
 * const balance = getBalanceByAddress(vaultData, address);
 * console.log(`You have ${formatLCCBalance(balance)} LCC tokens`);
 * ```
 */
export function formatTokenBalance(balanceStr: string): string {
  const balanceBigInt = BigInt(balanceStr);

  // Token has 9 decimal places (like IOTA)
  const decimals = 9;
  const divisor = BigInt(10 ** decimals);

  const wholePart = balanceBigInt / divisor;

  const wholeFormatted = wholePart.toLocaleString();

  return `${wholeFormatted}`;
}

export function getObjectExplorerUrl(objectId: string): string {
  return `${EXPLORER_URL}/object/${objectId}?network=${NETWORK}`;
}

export function getAddressExplorerUrl(address: string): string {
  return `${EXPLORER_URL}/address/${address}?network=${NETWORK}`;
}

export function getTxBlockExplorerUrl(txDigest: string): string {
  return `${EXPLORER_URL}/txblock/${txDigest}?network=${NETWORK}`;
}

export function getDidScheme(did: string): string {
  return `did:iota:${NETWORK}:${truncateAddress(did)}`;
}

export function getChain(): `${string}:${string}` {
  return `iota:${NETWORK}`;
}

// replaceComponents('Install Nightly Wallet ({COMPONENT} | {COMPONENT}) and connect when prompted.', [<Link />, <Link />])
// >>> ['Install Nightly Wallet (', <Link />,' | ',<Link />,') and connect when prompted.', undefined]
export function replaceComponents(text: string, components: React.ReactNode[]): unknown[] {
  const pieces = text.split('{COMPONENT}');
  const newComponents: unknown[] = [];
  pieces.forEach((eachPiece, idx) => {
    newComponents.push(eachPiece);
    newComponents.push(components.at(idx));
  });
  return newComponents;
}
