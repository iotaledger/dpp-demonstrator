// Copyright (c) IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

use dotenvy::dotenv;
use std::collections::HashMap;
use std::fs::{self, OpenOptions};
use std::io::Write;
use std::path::Path;

use anyhow::Context;
use backend::utils::{get_hierarchies_client, KeystoreClient};
use backend::utils::{MANUFACTURER_ALIAS, ROOT_AUTH_ALIAS};
use hierarchies::core::types::{
    property::FederationProperty, property_name::PropertyName, property_value::PropertyValue,
};
use iota_sdk::types::base_types::ObjectID;
use serde_json::json;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenv().ok();
    let hierarchies_client = get_hierarchies_client(ROOT_AUTH_ALIAS.to_string()).await?;
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

    let manufacturer_property_value = PropertyValue::Text("manufacturer".to_string());
    let repairer_property_value = PropertyValue::Text("repairer".to_string());

    // Create new federation
    let federation = hierarchies_client
        .create_new_federation()
        .build_and_execute(&hierarchies_client)
        .await?
        .output;
    let federation_id = *federation.id.object_id();
    println!("Federation ObjectId created: {}", federation_id);
    let mut value_key_hashmap: HashMap<&str, String> = HashMap::new();
    value_key_hashmap.insert("federation_id", federation_id.to_string());
    initialize_ith_persistence(value_key_hashmap).expect("Error initialize_ith_persistence");

    // Adding the Property to the Federation
    let property_name = PropertyName::from("role");
    let property = FederationProperty::new(property_name.clone()).with_allowed_values([
        manufacturer_property_value.clone(),
        repairer_property_value.clone(),
    ]);
    hierarchies_client
        .add_property(federation_id, property)
        .build_and_execute(&hierarchies_client)
        .await?;
    println!("✅ Federation property created");

    let manufacturer_properties = FederationProperty::new(property_name.clone())
        .with_allowed_values([manufacturer_property_value.clone()]);

    // Create accreditation to attest
    {
        hierarchies_client
            .create_accreditation_to_attest(
                federation_id,
                manufacturer_object_id.clone(),
                [manufacturer_properties],
            )
            .build_and_execute(&hierarchies_client)
            .await
            .context("Failed to create accreditation to attest")?;

        println!("✅ Attestation created");
    }

    // Validating attestation allowance
    let validation_result = hierarchies_client
        .validate_property(
            federation_id,
            manufacturer_object_id.clone(),
            property_name.clone(),
            manufacturer_property_value.clone(),
        )
        .await;

    match validation_result {
        Ok(true) => println!("✅ Attester is accredited to attest"),
        Ok(false) => {
            eprintln!("❌ Attester is not accredited to attest");
            panic!("validate_property failed!");
        }
        Err(e) => {
            eprintln!("❌ Failed to validate attestation allowance: {:?}", e);
            panic!("validate_property failed!");
        }
    }

    // Create accreditation to accredit
    let manufacturer_accreditation_property = FederationProperty::new(property_name.clone())
        .with_allowed_values([repairer_property_value.clone()]);

    let accreditation_result = hierarchies_client
        .create_accreditation_to_accredit(
            federation_id,
            manufacturer_object_id.clone(),
            [manufacturer_accreditation_property],
        )
        .build_and_execute(&hierarchies_client)
        .await;

    match accreditation_result {
        Ok(_) => println!("✅ Manufacturer accreditation has been successful."),
        Err(e) => {
            eprintln!("❌ Failed to accredit manufacturer: {:?}", e);
            panic!("create_accreditation failed!");
        }
    }

    let can_accredit = hierarchies_client
        .is_accreditor(federation_id, manufacturer_object_id.clone())
        .await?;
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
