// Copyright (c) IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

use anyhow::Context;
use backend::utils::get_hierarchies_client;
use backend::utils::MANUFACTURER_ALIAS;
use hierarchies::core::types::{
    property::FederationProperty, property_name::PropertyName, property_value::PropertyValue,
};
use iota_sdk::types::base_types::ObjectID;

pub async fn new_user_attestation(
    user_addr: String,
    user_role: String,
    federation_addr: String,
) -> anyhow::Result<()> {
    let hierarchies_client = get_hierarchies_client(MANUFACTURER_ALIAS.to_string()).await?;

    let user_object_id =
        ObjectID::from_hex_literal(&user_addr.as_str()).expect("user_object_id from_hex_literal");

    // Retrieve federation
    let federation_id = ObjectID::from_hex_literal(&federation_addr.as_str())
        .expect("Federation ID from_hex_literal");

    // Create accreditation to attest
    let property_name = PropertyName::from("role");
    let repairer_property_value = PropertyValue::Text(user_role.to_lowercase().clone());
    let repairer_attestation_property = FederationProperty::new(property_name.clone())
        .with_allowed_values([repairer_property_value.clone()]);

    {
        hierarchies_client
            .create_accreditation_to_attest(
                federation_id,
                user_object_id.clone(),
                [repairer_attestation_property],
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
            user_object_id.clone(),
            property_name.clone(),
            repairer_property_value.clone(),
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

    Ok(())
}
