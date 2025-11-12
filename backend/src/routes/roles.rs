// Copyright (c) IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

use axum::{routing::post, Router};

use crate::handlers::permission_handler::set_role;

pub fn routes() -> Router {
    Router::new().route("/", post(set_role))
}
