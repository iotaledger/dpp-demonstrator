// generate_did_configuration.rs
use dotenvy::dotenv;

use identity_iota::iota_interaction::KeytoolStorage as Keytool;
use identity_iota::storage::KeytoolStorage;

use identity_iota::{
    core::{Duration, Object, OrderedSet, Timestamp, ToJson, Url},
    credential::{
        DomainLinkageConfiguration, DomainLinkageCredentialBuilder, Jwt, LinkedDomainService,
    },
    did::{DIDUrl, DID},
    storage::{JwkDocumentExt, JwsSignatureOptions},
};

use backend::{
    identity_utils::create_did_document,
    utils::{MANUFACTURER_ALIAS, ROOT_AUTH_ALIAS},
};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenv().ok();

    // Create root and manufacturer DIDs
    let (_root_auth_doc, _root_auth_fragment) = create_did_document(ROOT_AUTH_ALIAS.clone())
        .await
        .expect("Error creating root authority DID");

    let (mut manufacturer_doc, manufacturer_vm_fragment) =
        create_did_document(MANUFACTURER_ALIAS.clone())
            .await
            .expect("Error creating manufacturer DID");

    let manufacturer_did = manufacturer_doc.id().clone();
    println!("✅ Manufacturer DID created: {manufacturer_did}");

    // Read the domain from env
    let domain_str =
        std::env::var("NEXT_PUBLIC_DAPP_URL").expect("Missing env var NEXT_PUBLIC_DAPP_URL");
    let domain_url: Url = Url::parse(&domain_str)?;

    // Add LinkedDomainService to the DID document
    let mut domains = OrderedSet::new();
    domains.append(domain_url.clone());

    let service_url: DIDUrl = manufacturer_did.clone().join("#domain-linkage")?;
    let linked_domain_service = LinkedDomainService::new(service_url, domains, Object::new())?;
    manufacturer_doc.insert_service(linked_domain_service.into())?;

    println!("🔗 LinkedDomainService added to DID");

    // Create Domain Linkage Credential
    let domain_linkage_credential = DomainLinkageCredentialBuilder::new()
        .issuer(manufacturer_did.clone().into())
        .origin(domain_url.clone())
        .issuance_date(Timestamp::now_utc())
        .expiration_date(
            Timestamp::now_utc()
                .checked_add(Duration::days(365))
                .ok_or_else(|| anyhow::anyhow!("Timestamp overflow"))?,
        )
        .build()?;

    // Sign the credential
    let jwt: Jwt = manufacturer_doc
        .create_credential_jwt(
            &domain_linkage_credential,
            &KeytoolStorage::from(Keytool::default()),
            &manufacturer_vm_fragment,
            &JwsSignatureOptions::default(),
            None,
        )
        .await?;

    // Build did-configuration.json
    let configuration_resource = DomainLinkageConfiguration::new(vec![jwt]);
    let configuration_json = configuration_resource.to_json()?;

    // Output the JSON string (you can save it to file if needed)
    println!(
        "✅ DID Configuration JSON (to serve at /.well-known/did-configuration.json):\n{configuration_json}"
    );

    Ok(())
}
