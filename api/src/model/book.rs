use chrono::{DateTime, Utc};
use derive_new::new;
use garde::Validate;
use kernel::model::{
    book::{Book, BookListOptions, Checkout, UpdateBook, event::CreateBook},
    id::{BookId, CheckoutId, UserId},
    list::PaginatedList,
};
use serde::{Deserialize, Serialize};
use utoipa::{IntoParams, ToSchema};
use uuid::Uuid;

use crate::model::user::{BookOwner, CheckoutUser};

/// 蔵書登録リクエスト
#[derive(Debug, Deserialize, Validate, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CreateBookRequest {
    /// 書籍のタイトル
    #[garde(length(min = 1))]
    #[schema(example = "The Rust Programming Language")]
    pub title: String,

    /// 著者名
    #[garde(length(min = 1))]
    #[schema(example = "Steve Klabnik and Carol Nichols")]
    pub author: String,

    /// ISBN（国際標準図書番号）
    #[garde(length(min = 1))]
    #[schema(example = "978-1593278281")]
    pub isbn: String,

    /// 書籍の説明・概要
    #[garde(skip)]
    #[schema(example = "The official book on the Rust programming language")]
    pub description: String,
}

impl From<CreateBookRequest> for CreateBook {
    fn from(value: CreateBookRequest) -> Self {
        let CreateBookRequest {
            title,
            author,
            isbn,
            description,
        } = value;

        Self {
            title,
            author,
            isbn,
            description,
        }
    }
}

/// 蔵書更新リクエスト
#[derive(Debug, Deserialize, Validate, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct UpdateBookRequest {
    /// 書籍のタイトル
    #[garde(length(min = 1))]
    #[schema(example = "The Rust Programming Language 2nd Edition")]
    pub title: String,

    /// 著者名
    #[garde(length(min = 1))]
    #[schema(example = "Steve Klabnik and Carol Nichols")]
    pub author: String,

    /// ISBN（国際標準図書番号）
    #[garde(length(min = 1))]
    #[schema(example = "978-1718503106")]
    pub isbn: String,

    /// 書籍の説明・概要
    #[garde(skip)]
    #[schema(
        example = "The official book on the Rust programming language, updated for Rust 2024"
    )]
    pub description: String,
}

#[derive(new)]
pub struct UpdateBookRequestWithIds(BookId, UserId, bool, UpdateBookRequest);

impl From<UpdateBookRequestWithIds> for UpdateBook {
    fn from(value: UpdateBookRequestWithIds) -> Self {
        let UpdateBookRequestWithIds(
            book_id,
            user_id,
            is_admin,
            UpdateBookRequest {
                title,
                author,
                isbn,
                description,
            },
        ) = value;

        Self {
            book_id,
            title,
            author,
            isbn,
            description,
            requested_user: user_id,
            is_admin,
        }
    }
}

/// 蔵書一覧取得のクエリパラメータ
#[derive(Debug, Deserialize, Validate, IntoParams)]
pub struct BookListQuery {
    /// 取得件数の上限（デフォルト: 20）
    #[garde(range(min = 0))]
    #[serde(default = "default_limit")]
    #[param(example = 20)]
    pub limit: i64,

    /// 取得開始位置（0始まり、デフォルト: 0）
    #[garde(range(min = 0))]
    #[serde(default)]
    #[param(example = 0)]
    pub offset: i64,
}

const DEFAULT_LIMIT: i64 = 20;
const fn default_limit() -> i64 {
    DEFAULT_LIMIT
}

impl From<BookListQuery> for BookListOptions {
    fn from(value: BookListQuery) -> Self {
        let BookListQuery { limit, offset } = value;
        Self { limit, offset }
    }
}

/// 蔵書の貸出情報
#[derive(Debug, Deserialize, Serialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct BookCheckoutResponse {
    /// 貸出ID
    #[schema(value_type = String, example = "550e8400-e29b-41d4-a716-446655440000")]
    pub id: CheckoutId,
    /// 借りているユーザー
    pub checked_out_by: CheckoutUser,
    /// 貸出日時
    #[schema(example = "2024-01-15T10:30:00Z")]
    pub checked_out_at: DateTime<Utc>,
}

impl From<Checkout> for BookCheckoutResponse {
    fn from(value: Checkout) -> Self {
        let Checkout {
            checkout_id,
            checked_out_by,
            checked_out_at,
        } = value;
        Self {
            id: checkout_id,
            checked_out_by: checked_out_by.into(),
            checked_out_at,
        }
    }
}

/// 蔵書詳細レスポンス
#[derive(Debug, Deserialize, Serialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct BookResponse {
    /// 蔵書ID
    #[schema(value_type = String, example = "550e8400-e29b-41d4-a716-446655440000")]
    pub id: Uuid,
    /// 書籍のタイトル
    #[schema(example = "The Rust Programming Language")]
    pub title: String,
    /// 著者名
    #[schema(example = "Steve Klabnik and Carol Nichols")]
    pub author: String,
    /// ISBN（国際標準図書番号）
    #[schema(example = "978-1593278281")]
    pub isbn: String,
    /// 書籍の説明・概要
    #[schema(example = "The official book on the Rust programming language")]
    pub description: String,
    /// 蔵書の所有者（登録者）
    pub owner: BookOwner,
    /// 現在の貸出情報（貸出中でなければnull）
    pub checkout: Option<BookCheckoutResponse>,
}

impl From<Book> for BookResponse {
    fn from(value: Book) -> Self {
        let Book {
            id,
            title,
            author,
            isbn,
            description,
            owner,
            checkout,
        } = value;

        Self {
            id,
            title,
            author,
            isbn,
            description,
            owner: owner.into(),
            checkout: checkout.map(BookCheckoutResponse::from),
        }
    }
}

/// ページネーション付き蔵書一覧レスポンス
#[derive(Debug, Deserialize, Serialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct PaginatedBookResponse {
    /// 総件数
    #[schema(example = 100)]
    pub total: i64,
    /// 取得件数の上限
    #[schema(example = 20)]
    pub limit: i64,
    /// 取得開始位置（0始まり）
    #[schema(example = 0)]
    pub offset: i64,
    /// 蔵書一覧
    pub items: Vec<BookResponse>,
}

impl From<PaginatedList<Book>> for PaginatedBookResponse {
    fn from(value: PaginatedList<Book>) -> Self {
        let PaginatedList {
            items,
            total,
            limit,
            offset,
        } = value;

        Self {
            total,
            limit,
            offset,
            items: items.into_iter().map(BookResponse::from).collect(),
        }
    }
}
