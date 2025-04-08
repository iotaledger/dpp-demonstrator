use crate::services::blockchain::new_user_attestation;
use axum::{extract::Json, http::StatusCode, response::IntoResponse};
use serde::{Deserialize, Serialize};
use std::fmt;

#[derive(Deserialize, Debug)]
pub struct RoleRequest {
    user_addr: String,
    user_role: UserRole,
    federation_addr: String,
}

#[derive(Serialize)]
pub struct RoleResponse {
    message: String,
}

#[derive(Deserialize, Debug)]
enum UserRole {
    Manufacturer,
    Repairer,
}

impl fmt::Display for UserRole {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let role_str = match self {
            UserRole::Manufacturer => "Manufacturer",
            UserRole::Repairer => "Repairer",
        };
        write!(f, "{}", role_str)
    }
}

pub async fn set_role(Json(payload): Json<RoleRequest>) -> impl IntoResponse {
    println!("Request received set_role: {:?}", payload);

    match new_user_attestation(
        payload.user_addr.clone(),
        payload.user_role.to_string(),
        payload.federation_addr.clone(),
    )
    .await
    {
        Ok(_) => {
            let response = RoleResponse {
                message: format!(
                    "User {} granted {} permission on federation {}",
                    payload.user_addr, payload.user_role, payload.federation_addr
                ),
            };
            (StatusCode::OK, Json(response))
        }
        Err(err) => {
            eprintln!("Error setting permission: {:?}", err);
            let error_response = RoleResponse {
                message: format!("Failed to set permission: {}", err),
            };
            (StatusCode::INTERNAL_SERVER_ERROR, Json(error_response))
        }
    }
}
