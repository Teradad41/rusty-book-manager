use chrono::{DateTime, Utc};
use kernel::model::{
    checkout::{Checkout, CheckoutBook},
    id::{BookId, CheckoutId},
};
use serde::Serialize;
use utoipa::ToSchema;

use crate::model::user::CheckoutUser;

/// 貸出一覧レスポンス
#[derive(Serialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CheckoutsResponse {
    /// 貸出情報一覧
    pub items: Vec<CheckoutResponse>,
}

impl From<Vec<Checkout>> for CheckoutsResponse {
    fn from(value: Vec<Checkout>) -> Self {
        Self {
            items: value.into_iter().map(CheckoutResponse::from).collect(),
        }
    }
}

/// 貸出情報レスポンス
#[derive(Serialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CheckoutResponse {
    /// 貸出ID
    #[schema(value_type = String, example = "550e8400-e29b-41d4-a716-446655440000")]
    pub id: CheckoutId,
    /// 借りているユーザー
    pub checked_out_by: CheckoutUser,
    /// 貸出日時
    #[schema(example = "2024-01-15T10:30:00Z")]
    pub checked_out_at: DateTime<Utc>,
    /// 返却日時（未返却の場合はnull）
    #[schema(example = "2024-01-22T14:00:00Z")]
    pub returned_at: Option<DateTime<Utc>>,
    /// 貸出中の蔵書情報
    pub book: CheckoutBookResponse,
}

impl From<Checkout> for CheckoutResponse {
    fn from(value: Checkout) -> Self {
        let Checkout {
            id,
            checked_out_by,
            checked_out_at,
            returned_at,
            book,
        } = value;
        Self {
            id,
            checked_out_by: checked_out_by.into(),
            checked_out_at,
            returned_at,
            book: book.into(),
        }
    }
}

/// 貸出蔵書の簡易情報
#[derive(Serialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CheckoutBookResponse {
    /// 蔵書ID
    #[schema(value_type = String, example = "550e8400-e29b-41d4-a716-446655440000")]
    pub id: BookId,
    /// 書籍のタイトル
    #[schema(example = "The Rust Programming Language")]
    pub title: String,
    /// 著者名
    #[schema(example = "Steve Klabnik and Carol Nichols")]
    pub author: String,
    /// ISBN（国際標準図書番号）
    #[schema(example = "978-1593278281")]
    pub isbn: String,
}

impl From<CheckoutBook> for CheckoutBookResponse {
    fn from(value: CheckoutBook) -> Self {
        let CheckoutBook {
            book_id,
            title,
            author,
            isbn,
        } = value;
        Self {
            id: book_id,
            title,
            author,
            isbn,
        }
    }
}
