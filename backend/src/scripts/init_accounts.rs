use std::fs::{self, OpenOptions};
use std::io::Write;
use std::path::Path;

use anyhow;
use backend::utils::{KeystoreClient, GAS_STATION_ALIAS, MANUFACTURER_ALIAS, ROOT_AUTH_ALIAS};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    initialize_keystore().expect("Error initialize_keystore");
    KeystoreClient::new(ROOT_AUTH_ALIAS.to_string());
    KeystoreClient::new(MANUFACTURER_ALIAS.to_string());
    KeystoreClient::new(GAS_STATION_ALIAS.to_string());
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
