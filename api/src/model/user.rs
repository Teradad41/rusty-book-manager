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

#[derive(Serialize, Deserialize, VariantNames, ToSchema)]
#[strum(serialize_all = "kebab-case")]
pub enum RoleName {
    Admin,
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

#[derive(Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct UsersResponse {
    pub items: Vec<UserResponse>,
}

#[derive(Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct UserResponse {
    #[schema(value_type = String)]
    pub id: UserId,
    pub name: String,
    pub email: String,
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

#[derive(Deserialize, Validate, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct UpdateUserPasswordRequest {
    #[garde(length(min = 1))]
    pub current_password: String,
    #[garde(length(min = 1))]
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

#[derive(Deserialize, Validate, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CreateUserRequest {
    #[garde(length(min = 1))]
    pub name: String,
    #[garde(email)]
    pub email: String,
    #[garde(length(min = 1))]
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

#[derive(Deserialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct UpdateUserRoleRequest {
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

#[derive(Debug, Serialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct BookOwner {
    #[schema(value_type = String)]
    pub id: UserId,
    pub name: String,
}

impl From<kernel::model::user::BookOwner> for BookOwner {
    fn from(value: kernel::model::user::BookOwner) -> Self {
        let kernel::model::user::BookOwner { id, name } = value;
        Self { id, name }
    }
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CheckoutUser {
    #[schema(value_type = String)]
    pub id: UserId,
    pub name: String,
}

impl From<kernel::model::user::CheckoutUser> for CheckoutUser {
    fn from(value: kernel::model::user::CheckoutUser) -> Self {
        let kernel::model::user::CheckoutUser { id, name } = value;
        Self { id, name }
    }
}
