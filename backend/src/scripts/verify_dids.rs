// Copyright (c) IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

use std::str::FromStr;

// validate_domain_linkage.rs
use dotenvy::dotenv;

use identity_ecdsa_verifier::EcDSAJwsVerifier;
use identity_iota::credential::{
    DomainLinkageConfiguration, DomainLinkageValidationError, JwtCredentialValidationOptions,
    JwtDomainLinkageValidator, LinkedDomainService,
};
use identity_iota::iota::IotaDID;
use identity_iota::{core::Url, iota::IotaDocument, resolver::Resolver};

use backend::{identity_utils::get_client, utils::MANUFACTURER_ALIAS};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenv().ok();

    // Read domain from env
    let domain_str =
        std::env::var("NEXT_PUBLIC_DAPP_URL").expect("Missing env var NEXT_PUBLIC_DAPP_URL");
    let domain_url: Url = Url::parse(&domain_str.clone())?;

    let did_str = std::env::var("MANUFACTURER_DID").expect("Missing env var MANUFACTURER_DID");
    let did = IotaDID::from_str(&did_str).expect("Error: IotaDID::from_str");

    let identity_client = get_client(MANUFACTURER_ALIAS)
        .await
        .expect("Error: get_client");

    let mut resolver: Resolver<IotaDocument> = Resolver::new();
    resolver.attach_iota_handler((*identity_client).clone());

    let did_document: IotaDocument = resolver.resolve(&did).await?;

    let linked_domain_services: Vec<LinkedDomainService> = did_document
        .service()
        .iter()
        .cloned()
        .filter_map(|service| LinkedDomainService::try_from(service).ok())
        .collect();
    assert_eq!(linked_domain_services.len(), 1);

    let domains: &[Url] = linked_domain_services
        .first()
        .ok_or_else(|| anyhow::anyhow!("expected a domain"))?
        .domains();
    let domain_from_did: Url = domains
        .first()
        .ok_or_else(|| anyhow::anyhow!("expected a domain"))?
        .clone();
    //assert_eq!(domain_from_did, domain_str.clone());

    let configuration_resource =
        DomainLinkageConfiguration::fetch_configuration(domain_url.clone()).await?;

    // Validate the linkage.
    let validation_result: Result<(), DomainLinkageValidationError> =
        JwtDomainLinkageValidator::with_signature_verifier(EcDSAJwsVerifier::default())
            .validate_linkage(
                &did_document,
                &configuration_resource,
                &domain_from_did,
                &JwtCredentialValidationOptions::default(),
            );
    if validation_result.is_ok() {
        println!("✅ Successfull domain linkage validation");
    } else {
        println!("❌ Unsuccessfull domain linkage validation");
        println!("{:?}", validation_result);
        println!("{}", did_document)
    }

    Ok(())
}
