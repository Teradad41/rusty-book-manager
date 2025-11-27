use axum::{
    Json,
    extract::{Path, Query, State},
    http::StatusCode,
};
use garde::Validate;
use kernel::model::{book::DeleteBook, id::BookId};
use registry::AppRegistry;
use shared::error::{AppError, AppResult};

use crate::{
    extractor::AuthorizedUser,
    model::book::{
        BookListQuery, BookResponse, CreateBookRequest, PaginatedBookResponse, UpdateBookRequest,
        UpdateBookRequestWithIds,
    },
};

#[utoipa::path(
    post,
    path = "/books",
    tag = "蔵書",
    request_body = CreateBookRequest,
    responses(
        (status = 201, description = "蔵書の登録成功"),
        (status = 400, description = "リクエストパラメータ不正"),
        (status = 401, description = "認証エラー"),
        (status = 422, description = "リクエストした蔵書の登録に失敗した場合"),
    ),
    security(
        ("bearer_auth" = [])
    )
)]
pub async fn register_book(
    user: AuthorizedUser,
    State(registry): State<AppRegistry>,
    Json(req): Json<CreateBookRequest>,
) -> AppResult<StatusCode> {
    registry
        .book_repository()
        .create(req.into(), user.id())
        .await
        .map(|_| StatusCode::CREATED)
}

#[utoipa::path(
    get,
    path = "/books",
    tag = "蔵書",
    params(
        BookListQuery
    ),
    responses(
        (status = 200, description = "蔵書一覧の取得成功", body = PaginatedBookResponse),
    )
)]
pub async fn show_book_list(
    _user: AuthorizedUser,
    Query(query): Query<BookListQuery>,
    State(registry): State<AppRegistry>,
) -> AppResult<Json<PaginatedBookResponse>> {
    query.validate()?;

    registry
        .book_repository()
        .find_all(query.into())
        .await
        .map(PaginatedBookResponse::from)
        .map(Json)
}

#[utoipa::path(
    get,
    path = "/books/{book_id}",
    tag = "蔵書",
    params(
        ("book_id" = String, Path, description = "蔵書ID")
    ),
    responses(
        (status = 200, description = "蔵書詳細の取得成功", body = BookResponse),
        (status = 404, description = "蔵書が存在しない"),
    )
)]
pub async fn show_book(
    _user: AuthorizedUser,
    Path(book_id): Path<BookId>,
    State(registry): State<AppRegistry>,
) -> AppResult<Json<BookResponse>> {
    registry
        .book_repository()
        .find_by_id(book_id)
        .await
        .and_then(|bc| match bc {
            Some(bc) => Ok(Json(bc.into())),
            None => Err(AppError::EntityNotFound("not found".into())),
        })
}

#[utoipa::path(
    put,
    path = "/books/{book_id}",
    tag = "蔵書",
    params(
        ("book_id" = String, Path, description = "蔵書ID")
    ),
    request_body = UpdateBookRequest,
    responses(
        (status = 204, description = "蔵書の更新成功"),
        (status = 400, description = "リクエストパラメータ不正"),
        (status = 401, description = "認証エラー"),
        (status = 404, description = "蔵書が存在しない"),
    ),
    security(
        ("bearer_auth" = [])
    )
)]
pub async fn update_book(
    user: AuthorizedUser,
    Path(book_id): Path<BookId>,
    State(registry): State<AppRegistry>,
    Json(req): Json<UpdateBookRequest>,
) -> AppResult<StatusCode> {
    req.validate()?;

    let update_book = UpdateBookRequestWithIds::new(book_id, user.id(), req);

    registry
        .book_repository()
        .update(update_book.into())
        .await
        .map(|_| StatusCode::NO_CONTENT)
}

#[utoipa::path(
    delete,
    path = "/books/{book_id}",
    tag = "蔵書",
    params(
        ("book_id" = String, Path, description = "蔵書ID")
    ),
    responses(
        (status = 204, description = "蔵書の削除成功"),
        (status = 401, description = "認証エラー"),
        (status = 404, description = "蔵書が存在しない"),
    ),
    security(
        ("bearer_auth" = [])
    )
)]
pub async fn delete_book(
    user: AuthorizedUser,
    Path(book_id): Path<BookId>,
    State(registry): State<AppRegistry>,
) -> AppResult<StatusCode> {
    let delete_book = DeleteBook {
        book_id,
        requested_user: user.id(),
    };

    registry
        .book_repository()
        .delete(delete_book)
        .await
        .map(|_| StatusCode::NO_CONTENT)
}
