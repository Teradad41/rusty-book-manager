use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use kernel::model::{
    checkout::event::{CreateCheckout, UpdateReturned},
    id::{BookId, CheckoutId},
};
use registry::AppRegistry;
use shared::error::AppResult;

use crate::{extractor::AuthorizedUser, model::checkout::CheckoutsResponse};

#[utoipa::path(
    post,
    path = "/books/{book_id}/checkouts",
    tag = "貸出・返却",
    params(
        ("book_id" = String, Path, description = "蔵書ID")
    ),
    responses(
        (status = 201, description = "貸出成功"),
        (status = 400, description = "リクエストパラメータ不正"),
        (status = 401, description = "認証エラー"),
        (status = 404, description = "蔵書が存在しない"),
    ),
    security(
        ("bearer_auth" = [])
    )
)]
pub async fn checkout_book(
    user: AuthorizedUser,
    Path(book_id): Path<BookId>,
    State(registry): State<AppRegistry>,
) -> AppResult<StatusCode> {
    let create_checkout_history = CreateCheckout::new(book_id, user.id(), chrono::Utc::now());

    registry
        .checkout_repository()
        .create(create_checkout_history)
        .await
        .map(|_| StatusCode::CREATED)
}

#[utoipa::path(
    put,
    path = "/books/{book_id}/checkouts/{checkout_id}/returned",
    tag = "貸出・返却",
    params(
        ("book_id" = String, Path, description = "蔵書ID"),
        ("checkout_id" = String, Path, description = "貸出ID")
    ),
    responses(
        (status = 201, description = "返却成功"),
        (status = 400, description = "リクエストパラメータ不正"),
        (status = 401, description = "認証エラー"),
        (status = 404, description = "蔵書または貸出が存在しない"),
    ),
    security(
        ("bearer_auth" = [])
    )
)]
pub async fn return_book(
    user: AuthorizedUser,
    Path((book_id, checkout_id)): Path<(BookId, CheckoutId)>,
    State(registry): State<AppRegistry>,
) -> AppResult<StatusCode> {
    let update_returned = UpdateReturned::new(checkout_id, book_id, user.id(), chrono::Utc::now());

    registry
        .checkout_repository()
        .update_returned(update_returned)
        .await
        .map(|_| StatusCode::CREATED)
}

#[utoipa::path(
    get,
    path = "/books/checkouts",
    tag = "貸出・返却",
    responses(
        (status = 200, description = "貸出中蔵書一覧の取得成功", body = CheckoutsResponse),
        (status = 401, description = "認証エラー"),
    ),
    security(
        ("bearer_auth" = [])
    )
)]
pub async fn show_checked_out_list(
    _user: AuthorizedUser,
    State(registry): State<AppRegistry>,
) -> AppResult<Json<CheckoutsResponse>> {
    registry
        .checkout_repository()
        .find_unreturned_all()
        .await
        .map(CheckoutsResponse::from)
        .map(Json)
}

#[utoipa::path(
    get,
    path = "/books/{book_id}/checkout-history",
    tag = "貸出・返却",
    params(
        ("book_id" = String, Path, description = "蔵書ID")
    ),
    responses(
        (status = 200, description = "貸出履歴の取得成功", body = CheckoutsResponse),
        (status = 401, description = "認証エラー"),
        (status = 404, description = "蔵書が存在しない"),
    ),
    security(
        ("bearer_auth" = [])
    )
)]
pub async fn checkout_history(
    _user: AuthorizedUser,
    Path(book_id): Path<BookId>,
    State(registry): State<AppRegistry>,
) -> AppResult<Json<CheckoutsResponse>> {
    registry
        .checkout_repository()
        .find_history_by_book_id(book_id)
        .await
        .map(CheckoutsResponse::from)
        .map(Json)
}
