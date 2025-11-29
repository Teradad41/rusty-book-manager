use kernel::model::id::UserId;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

/// ログインリクエスト
#[derive(Deserialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct LoginRequest {
    /// ログインに使用するメールアドレス
    #[schema(example = "test@example.com")]
    pub email: String,
    /// パスワード
    #[schema(example = "password")]
    pub password: String,
}

/// ログイン成功時のレスポンス
#[derive(Serialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct AccessTokenResponse {
    /// ログインしたユーザーのID
    #[schema(value_type = String, example = "550e8400-e29b-41d4-a716-446655440000")]
    pub user_id: UserId,
    /// APIアクセスに使用するトークン。Authorization ヘッダーに Bearer {access_token} 形式で指定
    #[schema(example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")]
    pub access_token: String,
}
