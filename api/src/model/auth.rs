use kernel::model::id::UserId;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Deserialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct LoginRequest {
    #[schema(example = "test@example.com")]
    pub email: String,
    #[schema(example = "password")]
    pub password: String,
}

#[derive(Serialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct AccessTokenResponse {
    #[schema(value_type = String)]
    pub user_id: UserId,
    pub access_token: String,
}
