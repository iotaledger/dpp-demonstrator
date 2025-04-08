use dotenvy::dotenv;
use std::collections::{HashMap, HashSet};
use std::fs::{self, OpenOptions};
use std::io::Write;
use std::path::Path;

use anyhow::Context;
use backend::utils::{get_ith_client, KeystoreClient};
use backend::utils::{MANUFACTURER_ALIAS, ROOT_AUTH_ALIAS};
use iota_sdk::types::base_types::ObjectID;
use ith::types::{Federation, Timespan, TrustedPropertyConstraint};
use ith::types::{TrustedPropertyName, TrustedPropertyValue};
use serde_json::json;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenv().ok();
    let ith_client = get_ith_client(ROOT_AUTH_ALIAS.to_string()).await?;
    let keystore_client = KeystoreClient::get_keystore();
    let manufacturer_address = keystore_client
        .get_address(MANUFACTURER_ALIAS.to_string())
        .expect("Error get address: MANUFACTURER_ALIAS");
    let manufacturer_object_id = ObjectID::from_address(manufacturer_address.into());

    let root_auth_address = keystore_client
        .get_address(ROOT_AUTH_ALIAS.to_string())
        .expect("Error get address: ROOT_AUTH_ALIAS");
    let _root_auth_object_id = ObjectID::from_address(root_auth_address.into());

    println!("Root of Authority address: {}", root_auth_address);
    println!("Manufacturer address: {}", manufacturer_address);

    let manufacturer_trusted_property_value = TrustedPropertyValue::from("manufacturer");
    let repairer_trusted_property_value = TrustedPropertyValue::from("repairer");

    // Create new federation
    let federation = ith_client.new_federation(None).await?;
    let federation_id = *federation.id.object_id();
    println!("Federation ObjectId created: {}", federation_id);
    let mut value_key_hashmap: HashMap<&str, String> = HashMap::new();
    value_key_hashmap.insert("federation_id", federation_id.to_string());
    initialize_ith_persistence(value_key_hashmap).expect("Error initialize_ith_persistence");

    // Adding the trusted property to the federation
    let property_name = TrustedPropertyName::from("role");
    let values = [
        manufacturer_trusted_property_value.clone(),
        repairer_trusted_property_value.clone(),
    ];
    {
        ith_client
            .add_trusted_property(
                federation_id,
                property_name.clone(),
                values.clone(),
                false,
                None,
            )
            .await
            .context("Failed to add trusted property")?;
    }
    println!("✅ Trusted property created");

    let manufacturer_attestation_allowed_values =
        HashSet::from_iter([manufacturer_trusted_property_value.clone()]);

    let manufacturer_constraints = TrustedPropertyConstraint {
        property_name: property_name.clone(),
        allowed_values: manufacturer_attestation_allowed_values,
        expression: None,
        allow_any: false,
        timespan: Timespan::default(),
    };

    // Create attestation
    {
        ith_client
            .create_attestation(
                federation_id,
                manufacturer_object_id.clone(),
                vec![manufacturer_constraints.clone()],
                None,
            )
            .await
            .context("Failed to issue permission to attest")?;
    }

    println!("✅ Attestation created");

    // Validating trusted properties
    let trusted_properties = [(
        property_name.clone(),
        manufacturer_trusted_property_value.clone(),
    )];
    let validate_result = ith_client
        .onchain(federation_id)
        .validate_trusted_properties(manufacturer_object_id.clone(), trusted_properties.clone())
        .await;

    match validate_result {
        Ok(_) => println!("✅ Trusted property verified successfully."),
        Err(e) => {
            eprintln!("❌ Failed to validate trusted property: {:?}", e);
            panic!("validate_trusted_properties failed!");
        }
    }

    //Manufacturer accreditation
    let manufacturer_accreditation_allowed_values =
        HashSet::from_iter([repairer_trusted_property_value.clone()]);

    let manufacturer_accreditation_constraints = TrustedPropertyConstraint {
        property_name: property_name.clone(),
        allowed_values: manufacturer_accreditation_allowed_values,
        expression: None,
        allow_any: false,
        timespan: Timespan::default(),
    };

    let accreditation_result = ith_client
        .create_accreditation(
            federation_id,
            manufacturer_object_id.clone(),
            vec![manufacturer_accreditation_constraints.clone()],
            None,
        )
        .await;
    match accreditation_result {
        Ok(_) => println!("✅ Manufacturer accreditation has been successfull."),
        Err(e) => {
            eprintln!("❌ Failed to accredit manufacturer: {:?}", e);
            panic!("create_accreditation failed!");
        }
    }

    let updated_federation: Federation = ith_client.get_object_by_id(federation_id).await?;
    let can_accredit = updated_federation
        .governance
        .accreditors
        .contains_key(&manufacturer_object_id);
    assert!(can_accredit);
    println!("✅ Manufacturer can accredit");

    Ok(())
}

fn initialize_ith_persistence(key_values: HashMap<&str, String>) -> std::io::Result<()> {
    let data_path = "../data";
    let data_file = "../data/ith.json";

    if !Path::new(data_path).exists() {
        fs::create_dir_all(data_path)?;
        println!("Created folder: {}", data_path);
    }

    let json_content = json!(key_values).to_string();

    let mut file = OpenOptions::new()
        .write(true)
        .create(true)
        .open(data_file)?;

    file.write_all(json_content.as_bytes())?;
    println!("Created file: {} with key-value JSON", data_file);

    Ok(())
}
