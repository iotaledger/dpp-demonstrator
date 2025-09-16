
function get(envVar: string, isRequired?: boolean): string | undefined {
  if (isRequired && process.env[envVar] == null) {
    throw new Error(`The environment variable ${envVar} is not set.`);
  }
  return process.env[envVar];
}

/**
 * @deprecated
 */
export const PRODUCT_DETAILS = {
  /**
   * @deprecated Replace by `DPP_ID`
   */
  dppId: "0x04c545450fa0b988728ac027d8ea13035e95f51da9bb75e1cf2fa7777e7799fa",
};

/**
 * @deprecated
 */
export const FEDERATION_DETAILS = {
  /**
   * @deprecated Replace by `FEDERATION_ID`
   */
  federationAddr: "0x93f6e173eedf74064f7e0aa270c29667ded63c489f6cb6f91455de6fcc817da4",
};

/**
 * @deprecated Raplace by `AUDIT_TRAIL_PKG_ID`
 */
const AUDIT_TRAIL_DETAILS = {
  packageId: "0x1d0b1bdb1b5ff25102e2e9d3858f898cd6c9f016b87b496c2e041f0ac060c5e7",
};

/**
 * @deprecated
 */
export const REWARD_POOL_STATUS = {
  /**
   * @deprecated Replace by `VAULT_ID`
   */
  vaultId: "0xed269bb17177a70e020863a53fe1d0ff4e664a95dc305cd7531dfe5efbc8386c",
  /**
   * @deprecated Replace by `WHITELIST_ID`
   */
  whitelistId: "0xaa90b38876f747ffe4bf405b3639f528e4d78d6230812817bbfd20b5b34e6df6",
};

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
