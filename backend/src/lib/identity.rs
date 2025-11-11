// Copyright (c) IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

use std::path::PathBuf;

use anyhow::Context;
use identity_iota::credential::Credential;
use identity_iota::credential::Jwt;
use identity_iota::iota::IotaDocument;
use identity_iota::iota_interaction::KeytoolSigner;
use identity_iota::iota_interaction::KeytoolStorage as Keytool;
use identity_iota::storage::JwkDocumentExt;
use identity_iota::storage::JwsSignatureOptions;
use identity_iota::storage::KeytoolStorage;
use identity_iota::verification::jws::JwsAlgorithm;
use identity_iota::verification::MethodScope;

use identity_iota::{
    core::{Object, OrderedSet, Url},
    credential::LinkedDomainService,
    did::{DIDUrl, DID},
};

use identity_iota::iota::rebased::client::IdentityClient;
use identity_iota::iota::rebased::client::IdentityClientReadOnly;
use identity_iota::storage::KeyType;
use iota_sdk::types::base_types::IotaAddress;
use iota_sdk::IotaClientBuilder;
use iota_sdk::IOTA_TESTNET_URL;
use rand::distributions::DistString;
use serde_json::Value;

pub const TEST_GAS_BUDGET: u64 = 50_000_000;

pub async fn create_did_document(
    alias: &str,
    is_domain_linkage: bool,
) -> anyhow::Result<(IotaDocument, String)> {
    let keytool = Keytool::default();
    let iota_account = keytool
        .get_key_by_alias(alias)
        .expect("Error get_key_by_alias")
        .unwrap_or_else(|| {
            eprintln!("No key found for alias {alias}");
            std::process::exit(1);
        });

    let address = IotaAddress::from(&iota_account);

    let identity_client = {
        let read_only_client = get_read_only_client().await?;
        let signer = keytool.signer().with_address(address).build()?;
        IdentityClient::new(read_only_client, signer).await?
    };

    let keytool_storage = KeytoolStorage::from(keytool);
    let mut did_document = IotaDocument::new(identity_client.network());

    let _vm_fragment = did_document
        .generate_method(
            &keytool_storage,
            KeyType::new("secp256r1"),
            JwsAlgorithm::ES256,
            None,
            MethodScope::VerificationMethod,
        )
        .await?;

    if is_domain_linkage {
        let domain_str =
            std::env::var("NEXT_PUBLIC_DAPP_URL").expect("Missing env var NEXT_PUBLIC_DAPP_URL");
        let domain_url: Url = Url::parse(&domain_str)?;

        let mut domains = OrderedSet::new();
        domains.append(domain_url.clone());

        let service_url: DIDUrl = did_document.id().clone().join("#domain-linkage")?;
        let linked_domain_service = LinkedDomainService::new(service_url, domains, Object::new())?;
        did_document.insert_service(linked_domain_service.into())?;
    }

    let did_document = identity_client
        .publish_did_document(did_document)
        .build_and_execute(&identity_client)
        .await?
        .output;

    Ok((did_document, _vm_fragment))
}

pub async fn create_credential(
    credential: Credential,
    issuer_document: IotaDocument,
    issuer_vm_fragment: &str,
) -> anyhow::Result<Jwt> {
    let keytool = Keytool::default();
    let keytool_storage = KeytoolStorage::from(keytool);

    let credential_jwt: Jwt = issuer_document
        .create_credential_jwt(
            &credential,
            &keytool_storage,
            &issuer_vm_fragment,
            &JwsSignatureOptions::default(),
            None,
        )
        .await?;

    Ok(credential_jwt)
}

pub async fn get_client(alias: &str) -> Result<IdentityClient<KeytoolSigner>, anyhow::Error> {
    let keytool = Keytool::default();
    let iota_account = keytool
        .get_key_by_alias(alias)
        .expect("Error get_key_by_alias")
        .unwrap_or_else(|| {
            eprintln!("No key found for alias {alias}");
            std::process::exit(1);
        });

    let address = IotaAddress::from(&iota_account);
    println!("Alias address: {}", address);

    let identity_client = {
        let read_only_client = get_read_only_client().await?;
        let signer = keytool.signer().with_address(address).build()?;
        IdentityClient::new(read_only_client, signer).await?
    };

    Ok(identity_client)
}

pub fn random_stronghold_path() -> PathBuf {
    let mut file = std::env::temp_dir();
    file.push("test_strongholds");
    file.push(rand::distributions::Alphanumeric.sample_string(&mut rand::thread_rng(), 32));
    file.set_extension("stronghold");
    file.to_owned()
}

pub async fn get_read_only_client() -> anyhow::Result<IdentityClientReadOnly> {
    let api_endpoint =
        std::env::var("API_ENDPOINT").unwrap_or_else(|_| IOTA_TESTNET_URL.to_string());
    let iota_client = IotaClientBuilder::default()
        .build(&api_endpoint)
        .await
        .map_err(|err| anyhow::anyhow!(format!("failed to connect to network; {}", err)))?;
    let package_id = std::env::var("IOTA_IDENTITY_PKG_ID")
        .map_err(|e| {
            anyhow::anyhow!(
                "env variable IOTA_IDENTITY_PKG_ID must be set in order to run the examples"
            )
            .context(e)
        })
        .and_then(|pkg_str| pkg_str.parse().context("invalid package id"))?;

    IdentityClientReadOnly::new_with_pkg_id(iota_client, package_id)
        .await
        .context("failed to create a read-only IdentityClient")
}

pub fn pretty_print_json(label: &str, value: &str) {
    let data: Value = serde_json::from_str(value).unwrap();
    let pretty_json = serde_json::to_string_pretty(&data).unwrap();
    println!("--------------------------------------");
    println!("{}:", label);
    println!("--------------------------------------");
    println!("{} \n", pretty_json);
}
