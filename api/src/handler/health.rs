use axum::{extract::State, http::StatusCode};
use registry::AppRegistry;

#[utoipa::path(
    get,
    path = "/health",
    tag = "ヘルスチェック",
    responses(
        (status = 200, description = "ヘルスチェック成功"),
    )
)]
pub async fn health_check() -> StatusCode {
    StatusCode::OK
}

#[utoipa::path(
    get,
    path = "/health/db",
    tag = "ヘルスチェック",
    responses(
        (status = 200, description = "DBヘルスチェック成功"),
        (status = 500, description = "DBヘルスチェック失敗"),
    )
)]
pub async fn health_check_db(State(registry): State<AppRegistry>) -> StatusCode {
    if registry.health_check_repository().check_db().await {
        StatusCode::OK
    } else {
        StatusCode::INTERNAL_SERVER_ERROR
    }
}
