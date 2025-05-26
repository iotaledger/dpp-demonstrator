// Copyright 2020-2024 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

use dotenvy::dotenv;

use backend::{
    identity_utils::create_did_document,
    utils::{MANUFACTURER_ALIAS, ROOT_AUTH_ALIAS},
};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenv().ok();

    let (root_auth_doc, _root_auth_vm_fragment) = create_did_document(ROOT_AUTH_ALIAS)
        .await
        .expect("Error: root auth did");

    let (manufacturer_doc, _manufacturer_vm_fragment) = create_did_document(MANUFACTURER_ALIAS)
        .await
        .expect("Error: manufacturer did");

    println!("Root Auth DID Document:\n{}", root_auth_doc.id());
    println!("Root Auth DID Document:\n{}", manufacturer_doc.id());

    Ok(())
}
