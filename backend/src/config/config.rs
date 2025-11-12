// Copyright (c) IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

use dotenvy::dotenv;
use std::env;

#[warn(dead_code)]
pub struct Config {
    pub api_key: String,
    pub tcp_listner: String,
}

impl Config {
    pub fn from_env() -> Self {
        dotenv().ok();

        Self {
            api_key: env::var("API_KEY").expect("API_KEY must be set"),
            tcp_listner: env::var("TCP_LISTNER").expect("TCP_LISTNER must be set"),
        }
    }
}
