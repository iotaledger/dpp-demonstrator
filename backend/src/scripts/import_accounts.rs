use dotenvy::dotenv;
use std::env;
use std::fs::{self, OpenOptions};
use std::io::Write;
use std::path::Path;

use anyhow;
use backend::utils::KeystoreClient;
use backend::utils::{MANUFACTURER_ALIAS, ROOT_AUTH_ALIAS};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenv().ok();

    let root_auth_secret_key =
        env::var("ROOT_AUTH_SECRET_KEY").expect("ROOT_AUTH_SECRET_KEY must be set");
    let manufacturer_secret_key =
        env::var("MANUFACTURER_SECRET_KEY").expect("MANUFACTURER_SECRET_KEY must be set");

    initialize_keystore().expect("Error initialize_keystore");
    KeystoreClient::import(root_auth_secret_key.as_str(), ROOT_AUTH_ALIAS)
        .expect("Error import root-auth");
    KeystoreClient::import(manufacturer_secret_key.as_str(), MANUFACTURER_ALIAS)
        .expect("Error import manufacturer");

    Ok(())
}

fn initialize_keystore() -> std::io::Result<()> {
    let keystore_path = "../keystore";
    let keystore_file = "../keystore/iota.keystore";

    if !Path::new(keystore_path).exists() {
        fs::create_dir_all(keystore_path)?;
        println!("Created folder: {}", keystore_path);
    }

    if !Path::new(keystore_file).exists() {
        let mut file = OpenOptions::new()
            .write(true)
            .create(true)
            .open(keystore_file)?;
        file.write_all(b"[]")?;
        println!("Created file: {} with empty array", keystore_file);
    }

    Ok(())
}
