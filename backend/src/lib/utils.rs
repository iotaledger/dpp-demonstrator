// Copyright (c) IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

use anyhow::{bail, Context, Result};
use fastcrypto::traits::{KeyPair, ToFromBytes};
use iota::client_commands;
use iota_config::{
    iota_config_dir, Config, PersistedConfig, IOTA_CLIENT_CONFIG, IOTA_KEYSTORE_FILENAME,
};
use iota_json_rpc_types::IotaTransactionBlockResponse;
use iota_keys::keystore::{AccountKeystore, FileBasedKeystore};
use iota_sdk::{
    iota_client_config::{IotaClientConfig, IotaEnv},
    rpc_types::IotaTransactionBlockResponseOptions,
    types::{
        base_types::IotaAddress,
        crypto::{IotaSignature, SignatureScheme::ED25519},
        quorum_driver_types::ExecuteTransactionRequestType,
        transaction::{Transaction, TransactionData},
    },
    wallet_context::WalletContext,
    IotaClient, IotaClientBuilder,
};
use ith::client::{ITHClient, ITHClientReadOnly};
use ith::key::IotaKeySignature;
use secret_storage::{SignatureScheme as SignerSignatureScheme, Signer as SignerTrait};
use shared_crypto::intent::Intent;
use std::process::Command;
use std::sync::Arc;

pub const ROOT_AUTH_ALIAS: &str = "root-auth";
pub const MANUFACTURER_ALIAS: &str = "manu-fact";
pub const GAS_STATION_ALIAS: &str = "gas-stat";

const GAS_LOCAL_NETWORK: &str = "https://faucet.testnet.iota.cafe/gas";

pub async fn get_ith_client(account_alias: String) -> anyhow::Result<ITHClient<KeystoreClient>> {
    let package_id = std::env::var("HIERARCHIES_PKG_ID")
        .context("HIERARCHIES_PKG_ID is not set in the environment variables")?
        .parse()?;

    let client = IotaClientBuilder::default().build_testnet().await?;
    println!("IOTA testnet version is: {}", client.api_version());

    let keystore_client = KeystoreClient::get_keystore();
    let user_address = keystore_client.get_address(account_alias.clone())?;
    println!("ith client address loaded: {:?}", user_address);

    let read_only_client = ITHClientReadOnly::new(client.clone(), package_id);
    Ok(ITHClient::new(read_only_client, keystore_client).await?)
}

pub async fn faucet(address: IotaAddress) -> anyhow::Result<()> {
    client_commands::request_tokens_from_faucet(address, GAS_LOCAL_NETWORK.to_string())
        .await
        .context("Failed to request tokens from faucet")?;
    tokio::time::sleep(std::time::Duration::from_millis(100)).await;
    Ok(())
}

#[derive(Clone)]
pub struct KeystoreClient(pub Arc<FileBasedKeystore>);

impl KeystoreClient {
    pub fn new(alias: String) -> Self {
        let keystore_path = iota_config_dir()
            .expect("Failed to get config directory")
            .join(IOTA_KEYSTORE_FILENAME);
        let mut file_based_keystore =
            FileBasedKeystore::new(&keystore_path).expect("Error creating Filestore");
        match file_based_keystore.generate_and_add_new_key(ED25519, Some(alias.clone()), None, None)
        {
            Ok(_) => println!("Key generated successfully."),
            Err(e) if e.to_string().contains("Alias") => {
                println!(
                    "Warning: Alias '{}' already exists. Using existing key.",
                    alias
                );
            }
            Err(e) => panic!("Unexpected error generating key: {:?}", e),
        }
        file_based_keystore
            .save_keystore()
            .expect("Error save keystore");
        KeystoreClient(Arc::new(file_based_keystore))
    }

    pub fn import(private_key: &str, alias: &str) -> Result<()> {
        let status = Command::new("iota")
            .args([
                "keytool",
                "import",
                private_key,
                "ed25519",
                "--alias",
                alias,
            ])
            .status()
            .with_context(|| "Error iota keytool import")?;

        if !status.success() {
            bail!("iota keytool import exit code no-zero");
        }

        println!("Account imported correctly '{}'", alias);
        Ok(())
    }

    pub fn get_keystore() -> Self {
        let keystore_path = iota_config_dir()
            .expect("Failed to get config directory")
            .join(IOTA_KEYSTORE_FILENAME);
        let file_based_keystore =
            FileBasedKeystore::new(&keystore_path).expect("Error retrieving Filestore");
        KeystoreClient(Arc::new(file_based_keystore))
    }

    pub fn get_address(&self, alias: String) -> anyhow::Result<IotaAddress> {
        self.0.get_address_by_alias(alias).map(|addr| *addr)
    }
}

#[async_trait::async_trait]
impl SignerTrait<IotaKeySignature> for KeystoreClient {
    type KeyId = ();
    async fn sign(
        &self,
        hash: &Vec<u8>,
    ) -> secret_storage::Result<<IotaKeySignature as SignerSignatureScheme>::Signature> {
        let address = self
            .0
            .get_address_by_alias(ROOT_AUTH_ALIAS.to_owned())
            .unwrap();
        let signature = self.0.sign_hashed(address, hash).unwrap();
        Ok(signature.signature_bytes().to_vec())
    }

    async fn public_key(
        &self,
    ) -> secret_storage::Result<<IotaKeySignature as secret_storage::SignatureScheme>::PublicKey>
    {
        let address = self
            .0
            .get_address_by_alias(ROOT_AUTH_ALIAS.to_owned())
            .unwrap();
        let res = self.0.get_key(address).unwrap();

        match res {
            iota_sdk::types::crypto::IotaKeyPair::Ed25519(key) => {
                Ok(key.public().as_bytes().to_vec())
            }
            _ => panic!("Unsupported key type"),
        }
    }
    fn key_id(&self) -> Self::KeyId {
        ()
    }
}

pub async fn setup_for_write(
    alias: Option<String>,
) -> Result<(IotaClient, IotaAddress, IotaAddress), anyhow::Error> {
    let (client, active_address) = setup_for_read(alias.clone()).await?;
    // make sure we have some IOTA (5_000_000 NANOS) on this address
    let wallet = retrieve_wallet(alias.clone())?;
    let addresses = wallet.get_addresses();
    let addresses = addresses
        .into_iter()
        .filter(|address| address != &active_address)
        .collect::<Vec<_>>();
    let recipient = addresses
        .first()
        .expect("Cannot get the recipient address needed for writing operations. Aborting");

    Ok((client, active_address, *recipient))
}

pub async fn setup_for_read(
    alias: Option<String>,
) -> Result<(IotaClient, IotaAddress), anyhow::Error> {
    let client = IotaClientBuilder::default().build_testnet().await?;
    println!("IOTA testnet version is: {}", client.api_version());
    let wallet = retrieve_wallet(alias)?;
    assert!(wallet.get_addresses().len() >= 2);
    let active_address = wallet.active_address()?;

    println!("Wallet active address is: {active_address}");
    Ok((client, active_address))
}

pub fn retrieve_wallet(alias: Option<String>) -> Result<WalletContext, anyhow::Error> {
    let wallet_conf = iota_config_dir()?.join(IOTA_CLIENT_CONFIG);
    let keystore_path = iota_config_dir()?.join(IOTA_KEYSTORE_FILENAME);

    // Controllo e creazione del keystore se non esiste
    if !keystore_path.exists() {
        let keystore = FileBasedKeystore::new(&keystore_path)?;
        keystore.save()?;
    }

    if !wallet_conf.exists() {
        let keystore = FileBasedKeystore::new(&keystore_path)?;
        let mut client_config = IotaClientConfig::new(keystore);

        client_config.add_env(IotaEnv::testnet());
        client_config.add_env(IotaEnv::devnet());
        client_config.add_env(IotaEnv::localnet());

        if client_config.active_env().is_none() {
            client_config
                .set_active_env(client_config.envs().first().map(|env| env.alias().clone()));
        }

        client_config.save(&wallet_conf)?;
        println!("Client config file is stored in {wallet_conf:?}.");
    }

    let mut keystore = FileBasedKeystore::new(&keystore_path)?;
    let mut client_config: IotaClientConfig = PersistedConfig::read(&wallet_conf)?;

    let selected_address = if let Some(alias) = alias {
        match keystore.get_address_by_alias(alias.clone()) {
            Ok(address) => {
                println!("Usando l'alias esistente: {}", alias);
                *address
            }
            Err(_) => {
                println!("Alias '{}' non trovato. Creando un nuovo account.", alias);
                keystore
                    .generate_and_add_new_key(ED25519, Some(alias.clone()), None, None)?
                    .0
            }
        }
    } else {
        if let Some(address) = keystore.addresses().first() {
            *address
        } else {
            keystore
                .generate_and_add_new_key(ED25519, None, None, None)?
                .0
        }
    };

    if keystore.addresses().len() < 2 {
        keystore.generate_and_add_new_key(ED25519, None, None, None)?;
    }

    client_config.set_active_address(selected_address);
    client_config.save(&wallet_conf)?;

    let wallet = WalletContext::new(&wallet_conf, std::time::Duration::from_secs(60), None)?;

    Ok(wallet)
}

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
