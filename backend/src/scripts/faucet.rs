// Copyright (c) IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

use backend::utils::{
    faucet, KeystoreClient, GAS_STATION_ALIAS, MANUFACTURER_ALIAS, ROOT_AUTH_ALIAS,
};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let keystore_client = KeystoreClient::get_keystore();
    let root_auth_address = keystore_client
        .get_address(ROOT_AUTH_ALIAS.to_string())
        .expect("Error get_address");
    let manufacturer_address = keystore_client
        .get_address(MANUFACTURER_ALIAS.to_string())
        .expect("Error get_address");
    let gas_station_address = keystore_client
        .get_address(GAS_STATION_ALIAS.to_string())
        .expect("Error get_address");

    faucet(root_auth_address).await.expect("Faucet error");
    faucet(manufacturer_address).await.expect("Faucet error");
    faucet(gas_station_address).await.expect("Faucet error");

    Ok(())
}
