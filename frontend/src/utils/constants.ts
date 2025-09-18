export const HAS_NFT_REWARD: boolean = false;

// Support to frontend components
export const DAPP_URL = process.env.NEXT_PUBLIC_DAPP_URL;
export const DPP_ID = process.env.NEXT_PUBLIC_PRODUCT_ID || '';
export const FEDERATION_ID = process.env.NEXT_PUBLIC_FEDERATION_ID;
export const NETWORK_URL = process.env.NEXT_PUBLIC_NETWORK_URL;
export const IOTA_IDENTITY_PKG_ID = process.env.NEXT_PUBLIC_IOTA_IDENTITY_PKG_ID;
export const AUDIT_TRAIL_PKG_ID = process.env.NEXT_PUBLIC_AUDIT_TRAIL_PKG;
export const WHITELIST_ID = process.env.NEXT_PUBLIC_REWARD_WHITELIST_ID;
export const VAULT_ID = process.env.NEXT_PUBLIC_REWARD_VAULT_ID;
export const NETWORK = process.env.NEXT_PUBLIC_NETWORK;
export const CURRENT_CHAIN: string = `iota:${NETWORK}`;
export const MANUFACTURER_NAME = "EcoBike";

// Support to backend APIs
export const BACKEND_ENDPOINT = process.env.BACKEND_ENDPOINT;
export const BACKEND_API_KEY = process.env.BACKEND_API_KEY;
export const GAS_STATION_URL = process.env.GAS_STATION_URL;
export const GAS_STATION_TOKEN = process.env.GAS_STATION_AUTH;
export const RESERVE_DURATION_SEC = 180;
