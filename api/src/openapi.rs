use utoipa::{
    Modify, OpenApi,
    openapi::security::{HttpAuthScheme, HttpBuilder, SecurityScheme},
};

#[derive(OpenApi)]
#[openapi(
    info(
        title = "Rusty Book Manager",
        version = "0.1.0",
        description = "書籍「RustによるWebアプリケーション開発」のサンプルアプリ",
        contact(
            name = "Kyo Terada",
            email = "sitiang120@gmail.com",
            url = "https://github.com/Teradad41/rusty-book-manager",
        ),
        license(name = "MIT", url = "https://opensource.org/licenses/MIT",),
    ),
    paths(
        crate::handler::health::health_check,
        crate::handler::health::health_check_db,
        crate::handler::auth::login,
        crate::handler::auth::logout,
        crate::handler::book::show_book_list,
        crate::handler::book::show_book,
        crate::handler::book::register_book,
        crate::handler::book::update_book,
        crate::handler::book::delete_book,
        crate::handler::checkout::checkout_book,
        crate::handler::checkout::return_book,
        crate::handler::checkout::checkout_history,
        crate::handler::checkout::show_checked_out_list,
        crate::handler::user::register_user,
        crate::handler::user::list_users,
        crate::handler::user::delete_user,
        crate::handler::user::change_role,
        crate::handler::user::change_password,
        crate::handler::user::get_current_user,
        crate::handler::user::get_checkouts,
    ),
    components(schemas(
        crate::model::auth::LoginRequest,
        crate::model::auth::AccessTokenResponse,
        crate::model::book::CreateBookRequest,
        crate::model::book::UpdateBookRequest,
        crate::model::book::BookResponse,
        crate::model::book::PaginatedBookResponse,
        crate::model::book::BookCheckoutResponse,
        crate::model::checkout::CheckoutsResponse,
        crate::model::checkout::CheckoutResponse,
        crate::model::checkout::CheckoutBookResponse,
        crate::model::user::CreateUserRequest,
        crate::model::user::UpdateUserPasswordRequest,
        crate::model::user::UpdateUserRoleRequest,
        crate::model::user::UserResponse,
        crate::model::user::UsersResponse,
        crate::model::user::RoleName,
        crate::model::user::BookOwner,
        crate::model::user::CheckoutUser,
    )),
    modifiers(&SecurityAddon),
)]
pub struct ApiDoc;

/// Bearer 認証スキーマを追加するための Modifier
struct SecurityAddon;

impl Modify for SecurityAddon {
    fn modify(&self, openapi: &mut utoipa::openapi::OpenApi) {
        if let Some(components) = openapi.components.as_mut() {
            components.add_security_scheme(
                "bearer_auth",
                SecurityScheme::Http(
                    HttpBuilder::new()
                        .scheme(HttpAuthScheme::Bearer)
                        .bearer_format("JWT")
                        .description(Some(
                            "ログインAPIで取得したアクセストークンを入力してください",
                        ))
                        .build(),
                ),
            );
        }
    }
}
