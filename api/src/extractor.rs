use axum::{RequestPartsExt, extract::FromRequestParts, http::request::Parts};
use axum_extra::TypedHeader;
use axum_extra::headers::Authorization;
use axum_extra::headers::authorization::Bearer;
use kernel::model::auth::AccessToken;
use kernel::model::id::UserId;
use kernel::model::role::Role;
use kernel::model::user::User;
use registry::AppRegistry;
use shared::error::AppError;

pub struct AuthorizedUser {
    pub access_token: AccessToken,
    pub user: User,
}

impl AuthorizedUser {
    pub fn id(&self) -> UserId {
        self.user.id
    }
    pub fn is_admin(&self) -> bool {
        self.user.role == Role::Admin
    }
}

impl FromRequestParts<AppRegistry> for AuthorizedUser {
    type Rejection = AppError;

    // handler メソッドの引数に AuthorizedUser を追加したときはこのメソッドが呼ばれる
    fn from_request_parts(
        parts: &mut Parts,
        registry: &AppRegistry,
    ) -> impl std::future::Future<Output = Result<Self, Self::Rejection>> + Send {
        async move {
            // HTTP ヘッダからアクセストークンを取り出す
            let TypedHeader(Authorization(bearer)) = parts
                .extract::<TypedHeader<Authorization<Bearer>>>()
                .await
                .map_err(|_| AppError::UnauthorizedError)?;
            let access_token = AccessToken(bearer.token().to_string());

            // アクセストークンが紐づくユーザー ID を抽出する
            let user_id = registry
                .auth_repository()
                .fetch_user_id_from_token(&access_token)
                .await?
                .ok_or(AppError::UnauthenticatedError)?;

            // ユーザー ID でデータベースからユーザーのレコードを引く
            let user = registry
                .user_repository()
                .find_current_user(user_id)
                .await?
                .ok_or(AppError::UnauthenticatedError)?;

            Ok(Self { access_token, user })
        }
    }
}
