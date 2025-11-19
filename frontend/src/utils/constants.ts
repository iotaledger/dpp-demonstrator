/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Internal control
 */

export const REQUEST_SIZE_LIMIT = 20;
export const NOTIFICATION_DECAY_TIME_MS = 8000;
export const RESERVE_DURATION_SEC = 180;
/** Finger dislocation in x axis to trigger a swipe*/
export const POSITION_CHANGE_TO_SWIPE = 110;

/**
 * Support to frontend components control
 */

export const HEALTH_SCORE_PROP = 'HealthScore';
export const FINDINGS_PROP = 'Findings';
export const REWARD_TOTAL_SUPPLY: string = '1000000000000000000'; // 1B
export const REWARD_TOKEN_SYMBOL: string = 'LCC';
export const HAS_NFT_REWARD: boolean = false;
export const DAPP_URL = process.env.NEXT_PUBLIC_DAPP_URL;
export const DPP_ID = process.env.NEXT_PUBLIC_PRODUCT_ID || '';
export const FEDERATION_ID = process.env.NEXT_PUBLIC_FEDERATION_ID || '';
export const NETWORK_URL = process.env.NEXT_PUBLIC_NETWORK_URL;
export const IOTA_IDENTITY_PKG_ID = process.env.NEXT_PUBLIC_IOTA_IDENTITY_PKG_ID;
export const IOTA_CUSTOM_NOTARIZATION_PKG_ID =
  process.env.NEXT_PUBLIC_IOTA_CUSTOM_NOTARIZATION_PKG_ID;
export const WHITELIST_ID = process.env.NEXT_PUBLIC_REWARD_WHITELIST_ID;
export const VAULT_ID = process.env.NEXT_PUBLIC_REWARD_VAULT_ID || '';
export const NETWORK = process.env.NEXT_PUBLIC_NETWORK;
export const CURRENT_CHAIN: string = `iota:${NETWORK}`;
export const MANUFACTURER_DID = process.env.NEXT_PUBLIC_MANUFACTURER_DID || '';
export const EXPLORER_URL = process.env.NEXT_PUBLIC_EXPLORER_URL;

/**
 * Support to backend APIs
 */

export const BACKEND_ENDPOINT = process.env.BACKEND_ENDPOINT;
export const BACKEND_API_KEY = process.env.BACKEND_API_KEY;
export const GAS_STATION_URL = process.env.GAS_STATION_URL;
export const GAS_STATION_TOKEN = process.env.GAS_STATION_AUTH;
export const GAS_BUDGET_DEFAULT = 100_000_000;
