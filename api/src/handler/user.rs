use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use garde::Validate;
use kernel::model::{id::UserId, user::event::DeleteUser};
use registry::AppRegistry;
use shared::error::{AppError, AppResult};

use crate::{
    extractor::AuthorizedUser,
    model::{
        checkout::CheckoutsResponse,
        user::{
            CreateUserRequest, UpdateUserPasswordRequest, UpdateUserPasswordRequestWithUserId,
            UpdateUserRoleRequest, UpdateUserRoleRequestWithUserId, UserResponse, UsersResponse,
        },
    },
};

#[utoipa::path(
    post,
    path = "/users",
    tag = "ユーザー",
    summary = "ユーザー登録",
    description = "新しいユーザーを登録します。管理者のみ実行可能です",
    operation_id = "registerUser",
    request_body = CreateUserRequest,
    responses(
        (status = 200, description = "ユーザー登録成功", body = UserResponse),
        (status = 400, description = "リクエストパラメータ不正"),
        (status = 401, description = "認証エラー"),
        (status = 403, description = "権限エラー（管理者のみ）"),
    ),
    security(
        ("bearer_auth" = [])
    )
)]
pub async fn register_user(
    user: AuthorizedUser,
    State(registry): State<AppRegistry>,
    Json(req): Json<CreateUserRequest>,
) -> AppResult<Json<UserResponse>> {
    if !user.is_admin() {
        return Err(AppError::ForbiddenOperation);
    }

    req.validate()?;

    let registered_user = registry.user_repository().create(req.into()).await?;
    Ok(Json(registered_user.into()))
}

#[utoipa::path(
    get,
    path = "/users",
    tag = "ユーザー",
    summary = "ユーザー一覧取得",
    description = "登録されているすべてのユーザーを取得します",
    operation_id = "listUsers",
    responses(
        (status = 200, description = "ユーザー一覧の取得成功", body = UsersResponse),
        (status = 401, description = "認証エラー"),
    ),
    security(
        ("bearer_auth" = [])
    )
)]
pub async fn list_users(
    _user: AuthorizedUser,
    State(registry): State<AppRegistry>,
) -> AppResult<Json<UsersResponse>> {
    let items = registry
        .user_repository()
        .find_all()
        .await?
        .into_iter()
        .map(UserResponse::from)
        .collect();

    Ok(Json(UsersResponse { items }))
}

#[utoipa::path(
    delete,
    path = "/users/{user_id}",
    tag = "ユーザー",
    summary = "ユーザー削除",
    description = "指定したユーザーを削除します。管理者のみ実行可能です",
    operation_id = "deleteUser",
    params(
        ("user_id" = String, Path, description = "ユーザーID")
    ),
    responses(
        (status = 200, description = "ユーザー削除成功"),
        (status = 401, description = "認証エラー"),
        (status = 403, description = "権限エラー（管理者のみ）"),
        (status = 404, description = "ユーザーが存在しない"),
    ),
    security(
        ("bearer_auth" = [])
    )
)]
pub async fn delete_user(
    user: AuthorizedUser,
    Path(user_id): Path<UserId>,
    State(registry): State<AppRegistry>,
) -> AppResult<StatusCode> {
    if !user.is_admin() {
        return Err(AppError::ForbiddenOperation);
    }

    registry
        .user_repository()
        .delete(DeleteUser { user_id })
        .await?;

    Ok(StatusCode::OK)
}

#[utoipa::path(
    put,
    path = "/users/{user_id}/role",
    tag = "ユーザー",
    summary = "ユーザーロール変更",
    description = "指定したユーザーのロール（権限）を変更します。管理者のみ実行可能です",
    operation_id = "changeUserRole",
    params(
        ("user_id" = String, Path, description = "ユーザーID")
    ),
    request_body = UpdateUserRoleRequest,
    responses(
        (status = 200, description = "ロール更新成功"),
        (status = 401, description = "認証エラー"),
        (status = 403, description = "権限エラー（管理者のみ）"),
        (status = 404, description = "ユーザーが存在しない"),
    ),
    security(
        ("bearer_auth" = [])
    )
)]
pub async fn change_role(
    user: AuthorizedUser,
    Path(user_id): Path<UserId>,
    State(registry): State<AppRegistry>,
    Json(req): Json<UpdateUserRoleRequest>,
) -> AppResult<StatusCode> {
    if !user.is_admin() {
        return Err(AppError::ForbiddenOperation);
    }

    registry
        .user_repository()
        .update_role(UpdateUserRoleRequestWithUserId::new(user_id, req).into())
        .await?;

    Ok(StatusCode::OK)
}

#[utoipa::path(
    get,
    path = "/users/me",
    tag = "ユーザー",
    summary = "現在のユーザー情報取得",
    description = "ログイン中のユーザー自身の情報を取得します",
    operation_id = "getCurrentUser",
    responses(
        (status = 200, description = "自身の情報の取得成功", body = UserResponse),
        (status = 401, description = "認証エラー"),
    ),
    security(
        ("bearer_auth" = [])
    )
)]
pub async fn get_current_user(user: AuthorizedUser) -> Json<UserResponse> {
    Json(UserResponse::from(user.user))
}

#[utoipa::path(
    put,
    path = "/users/me/password",
    tag = "ユーザー",
    summary = "パスワード変更",
    description = "ログイン中のユーザー自身のパスワードを変更します",
    operation_id = "changePassword",
    request_body = UpdateUserPasswordRequest,
    responses(
        (status = 200, description = "パスワード更新成功"),
        (status = 400, description = "リクエストパラメータ不正"),
        (status = 401, description = "認証エラー"),
    ),
    security(
        ("bearer_auth" = [])
    )
)]
pub async fn change_password(
    user: AuthorizedUser,
    State(registry): State<AppRegistry>,
    Json(req): Json<UpdateUserPasswordRequest>,
) -> AppResult<StatusCode> {
    req.validate()?;

    registry
        .user_repository()
        .update_password(UpdateUserPasswordRequestWithUserId::new(user.id(), req).into())
        .await?;

    Ok(StatusCode::OK)
}

#[utoipa::path(
    get,
    path = "/users/me/checkouts",
    tag = "ユーザー",
    summary = "自分の貸出一覧取得",
    description = "ログイン中のユーザーが現在借りている蔵書の一覧を取得します",
    operation_id = "getMyCheckouts",
    responses(
        (status = 200, description = "自身の貸出履歴の取得成功", body = CheckoutsResponse),
        (status = 401, description = "認証エラー"),
    ),
    security(
        ("bearer_auth" = [])
    )
)]
pub async fn get_checkouts(
    user: AuthorizedUser,
    State(registry): State<AppRegistry>,
) -> AppResult<Json<CheckoutsResponse>> {
    registry
        .checkout_repository()
        .find_unreturned_by_user_id(user.id())
        .await
        .map(CheckoutsResponse::from)
        .map(Json)
}
