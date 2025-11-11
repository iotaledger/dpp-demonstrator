// Copyright (c) IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

use axum::{
    extract::Request,
    http::{HeaderMap, StatusCode},
    middleware::{self, Next},
    response::Response,
    Router,
};

use crate::config::config::Config;

pub mod roles;

async fn auth(headers: HeaderMap, request: Request, next: Next) -> Result<Response, StatusCode> {
    let config = Config::from_env();

    match headers.get("x-api-key") {
        Some(header_value) if header_value == config.api_key.as_str() => {
            Ok(next.run(request).await)
        }
        _ => Err(StatusCode::UNAUTHORIZED),
    }
}

pub fn create_router() -> Router {
    let api_protected_routes = Router::new()
        .nest("/roles", roles::routes())
        .layer(middleware::from_fn(auth));

    Router::new().merge(api_protected_routes)
}
