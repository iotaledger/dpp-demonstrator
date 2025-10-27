use anyhow::Result;
use iota_config::{iota_config_dir, IOTA_KEYSTORE_FILENAME};
use iota_json_rpc_types::IotaTransactionBlockResponse;
use iota_keys::keystore::{AccountKeystore, FileBasedKeystore};
use iota_sdk::{
    rpc_types::IotaTransactionBlockResponseOptions,
    types::{
        base_types::IotaAddress,
        quorum_driver_types::ExecuteTransactionRequestType,
        transaction::{Transaction, TransactionData},
    },
    IotaClient,
};
use shared_crypto::intent::Intent;

pub async fn sign_and_execute_transaction(
    client: &IotaClient,
    sender: &IotaAddress,
    tx_data: TransactionData,
) -> Result<IotaTransactionBlockResponse, anyhow::Error> {
    let keystore = FileBasedKeystore::new(&iota_config_dir()?.join(IOTA_KEYSTORE_FILENAME))?;
    let signature = keystore.sign_secure(sender, &tx_data, Intent::iota_transaction())?;

    let transaction_block_response = client
        .quorum_driver_api()
        .execute_transaction_block(
            Transaction::from_data(tx_data, vec![signature]),
            IotaTransactionBlockResponseOptions::full_content(),
            ExecuteTransactionRequestType::WaitForLocalExecution,
        )
        .await?;

    Ok(transaction_block_response)
}