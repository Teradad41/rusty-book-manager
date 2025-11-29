use axum::{Json, extract::State, http::StatusCode};
use kernel::model::auth::event::CreateToken;
use registry::AppRegistry;
use shared::error::AppResult;

use crate::{
    extractor::AuthorizedUser,
    model::auth::{AccessTokenResponse, LoginRequest},
};

#[utoipa::path(
    post,
    path = "/auth/login",
    tag = "認証",
    summary = "ログイン",
    description = "メールアドレスとパスワードでログインし、アクセストークンを取得します",
    operation_id = "login",
    request_body = LoginRequest,
    responses(
        (status = 200, description = "ログイン成功", body = AccessTokenResponse),
        (status = 401, description = "認証エラー"),
        (status = 500, description = "サーバーエラー"),
    )
)]
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

#[utoipa::path(
    post,
    path = "/auth/logout",
    tag = "認証",
    summary = "ログアウト",
    description = "現在のセッションからログアウトし、アクセストークンを無効化します",
    operation_id = "logout",
    responses(
        (status = 204, description = "ログアウト成功"),
        (status = 401, description = "認証エラー"),
    ),
    security(
        ("bearer_auth" = [])
    )
)]
pub async fn logout(
    user: AuthorizedUser,
    State(registry): State<AppRegistry>,
) -> AppResult<StatusCode> {
    registry
        .auth_repository()
        .delete_token(user.access_token)
        .await?;

    Ok(StatusCode::NO_CONTENT)
}
