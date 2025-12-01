use derive_new::new;
use garde::Validate;
use kernel::model::{
    id::UserId,
    role::Role,
    user::{
        User,
        event::{CreateUser, UpdateUserPassword, UpdateUserRole},
    },
};
use serde::{Deserialize, Serialize};
use strum::VariantNames;
use utoipa::ToSchema;

/// ユーザーの権限ロール
#[derive(Serialize, Deserialize, VariantNames, ToSchema)]
#[strum(serialize_all = "kebab-case")]
pub enum RoleName {
    /// 管理者（ユーザー管理が可能）
    Admin,
    /// 一般ユーザー
    User,
}

impl From<Role> for RoleName {
    fn from(value: Role) -> Self {
        match value {
            Role::Admin => Self::Admin,
            Role::User => Self::User,
        }
    }
}

impl From<RoleName> for Role {
    fn from(value: RoleName) -> Self {
        match value {
            RoleName::Admin => Self::Admin,
            RoleName::User => Self::User,
        }
    }
}

/// ユーザー一覧レスポンス
#[derive(Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct UsersResponse {
    /// ユーザー一覧
    pub items: Vec<UserResponse>,
}

/// ユーザー情報レスポンス
#[derive(Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct UserResponse {
    /// ユーザーID
    #[schema(value_type = String, example = "550e8400-e29b-41d4-a716-446655440000")]
    pub id: UserId,
    /// ユーザー名
    #[schema(example = "山田太郎")]
    pub name: String,
    /// メールアドレス
    #[schema(example = "yamada@example.com")]
    pub email: String,
    /// ユーザーの権限ロール
    pub role: RoleName,
}

impl From<User> for UserResponse {
    fn from(value: User) -> Self {
        let User {
            id,
            name,
            email,
            role,
        } = value;

        Self {
            id,
            name,
            email,
            role: RoleName::from(role),
        }
    }
}

/// パスワード変更リクエスト
#[derive(Deserialize, Validate, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct UpdateUserPasswordRequest {
    /// 現在のパスワード
    #[garde(length(min = 1))]
    #[schema(example = "current_password123")]
    pub current_password: String,
    /// 新しいパスワード
    #[garde(length(min = 1))]
    #[schema(example = "new_password456")]
    pub new_password: String,
}

#[derive(new)]
pub struct UpdateUserPasswordRequestWithUserId(UserId, UpdateUserPasswordRequest);

impl From<UpdateUserPasswordRequestWithUserId> for UpdateUserPassword {
    fn from(value: UpdateUserPasswordRequestWithUserId) -> Self {
        let UpdateUserPasswordRequestWithUserId(
            user_id,
            UpdateUserPasswordRequest {
                current_password,
                new_password,
            },
        ) = value;

        UpdateUserPassword {
            user_id,
            current_password,
            new_password,
        }
    }
}

/// ユーザー登録リクエスト
#[derive(Deserialize, Validate, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CreateUserRequest {
    /// ユーザー名
    #[garde(length(min = 1))]
    #[schema(example = "山田太郎")]
    pub name: String,
    /// メールアドレス
    #[garde(email)]
    #[schema(example = "yamada@example.com")]
    pub email: String,
    /// パスワード
    #[garde(length(min = 1))]
    #[schema(example = "password123")]
    pub password: String,
}

impl From<CreateUserRequest> for CreateUser {
    fn from(value: CreateUserRequest) -> Self {
        let CreateUserRequest {
            name,
            email,
            password,
        } = value;

        Self {
            name,
            email,
            password,
        }
    }
}

/// ユーザーロール変更リクエスト
#[derive(Deserialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct UpdateUserRoleRequest {
    /// 変更後のロール
    pub role: RoleName,
}

#[derive(new)]
pub struct UpdateUserRoleRequestWithUserId(UserId, UpdateUserRoleRequest);

impl From<UpdateUserRoleRequestWithUserId> for UpdateUserRole {
    fn from(value: UpdateUserRoleRequestWithUserId) -> Self {
        let UpdateUserRoleRequestWithUserId(user_id, UpdateUserRoleRequest { role }) = value;

        Self {
            user_id,
            role: Role::from(role),
        }
    }
}

/// 蔵書の所有者情報
#[derive(Debug, Deserialize, Serialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct BookOwner {
    /// 所有者のユーザーID
    #[schema(value_type = String, example = "550e8400-e29b-41d4-a716-446655440000")]
    pub id: UserId,
    /// 所有者の名前
    #[schema(example = "山田太郎")]
    pub name: String,
}

impl From<kernel::model::user::BookOwner> for BookOwner {
    fn from(value: kernel::model::user::BookOwner) -> Self {
        let kernel::model::user::BookOwner { id, name } = value;
        Self { id, name }
    }
}

/// 貸出ユーザー情報
#[derive(Debug, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CheckoutUser {
    /// ユーザーID
    #[schema(value_type = String, example = "550e8400-e29b-41d4-a716-446655440000")]
    pub id: UserId,
    /// ユーザー名
    #[schema(example = "山田太郎")]
    pub name: String,
}

impl From<kernel::model::user::CheckoutUser> for CheckoutUser {
    fn from(value: kernel::model::user::CheckoutUser) -> Self {
        let kernel::model::user::CheckoutUser { id, name } = value;
        Self { id, name }
    }
}
