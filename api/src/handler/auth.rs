use axum::{Json, extract::State, http::StatusCode};
use kernel::model::auth::event::CreateToken;
use registry::AppRegistry;
use shared::error::AppResult;

use crate::model::auth::{AccessTokenResponse, LoginRequest};

pub async fn login(
    State(registry): State<AppRegistry>,
    Json(req): Json<LoginRequest>,
) -> AppResult<Json<AccessTokenResponse>> {
    let user_id = registry
        .auth_repository()
        .verify_user(&req.email, &req.password)
        .await?;

    let access_token = registry
        .auth_repository()
        .create_token(CreateToken::new(user_id))
        .await?;

    Ok(Json(AccessTokenResponse {
        user_id,
        access_token: access_token.0,
    }))
}

pub async fn logout() -> AppResult<StatusCode> {
    todo!()
}
