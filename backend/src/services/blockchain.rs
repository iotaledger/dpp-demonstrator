use std::collections::HashSet;

use anyhow::Context;
use backend::utils::get_ith_client;
use backend::utils::MANUFACTURER_ALIAS;
use iota_sdk::types::base_types::ObjectID;
use ith::types::{Timespan, TrustedPropertyConstraint};
use ith::types::{TrustedPropertyName, TrustedPropertyValue};

pub async fn new_user_attestation(
    user_addr: String,
    user_role: String,
    federation_addr: String,
) -> anyhow::Result<()> {
    let ith_client = get_ith_client(MANUFACTURER_ALIAS.to_string()).await?;

    let user_object_id =
        ObjectID::from_hex_literal(&user_addr.as_str()).expect("user_object_id from_hex_literal");

    // Retrieve new federation
    let federation_id = ObjectID::from_hex_literal(&federation_addr.as_str())
        .expect("Federation ID from_hex_literal");

    //attestation
    let property_name = TrustedPropertyName::from("role");
    let repairer_trusted_property_value =
        TrustedPropertyValue::from(user_role.to_lowercase().clone());
    let repairer_attestation_allowed_values =
        HashSet::from_iter([repairer_trusted_property_value.clone()]);

    let repairer_constraints = TrustedPropertyConstraint {
        property_name: property_name.clone(),
        allowed_values: repairer_attestation_allowed_values,
        expression: None,
        allow_any: false,
        timespan: Timespan::default(),
    };

    {
        ith_client
            .create_attestation(
                federation_id,
                user_object_id.clone(),
                vec![repairer_constraints.clone()],
                None,
            )
            .await
            .context("Failed to issue permission to attest")?;
    }
    println!("✅ Attestation created");

    // Validating trusted properties
    let trusted_properties = [(
        property_name.clone(),
        repairer_trusted_property_value.clone(),
    )];
    let validate_result = ith_client
        .onchain(federation_id)
        .validate_trusted_properties(user_object_id.clone(), trusted_properties.clone())
        .await;

    match validate_result {
        Ok(_) => println!("✅ Trusted property verified successfully."),
        Err(e) => {
            eprintln!("❌ Failed to validate trusted property: {:?}", e);
            panic!("validate_trusted_properties failed!");
        }
    }

    Ok(())
}
