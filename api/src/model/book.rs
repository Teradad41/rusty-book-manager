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

#[derive(Debug, Deserialize, Validate, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CreateBookRequest {
    #[garde(length(min = 1))]
    #[schema(example = "The Rust Programming Language")]
    pub title: String,

    #[garde(length(min = 1))]
    #[schema(example = "Steve Klabnik and Carol Nichols")]
    pub author: String,

    #[garde(length(min = 1))]
    #[schema(example = "978-1593278281")]
    pub isbn: String,

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

#[derive(Debug, Deserialize, Validate, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct UpdateBookRequest {
    #[garde(length(min = 1))]
    pub title: String,

    #[garde(length(min = 1))]
    pub author: String,

    #[garde(length(min = 1))]
    pub isbn: String,

    #[garde(skip)]
    pub description: String,
}

#[derive(new)]
pub struct UpdateBookRequestWithIds(BookId, UserId, UpdateBookRequest);

impl From<UpdateBookRequestWithIds> for UpdateBook {
    fn from(value: UpdateBookRequestWithIds) -> Self {
        let UpdateBookRequestWithIds(
            book_id,
            user_id,
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
        }
    }
}

#[derive(Debug, Deserialize, Validate, IntoParams)]
pub struct BookListQuery {
    #[garde(range(min = 0))]
    #[serde(default = "default_limit")]
    pub limit: i64,

    #[garde(range(min = 0))]
    #[serde(default)]
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

#[derive(Debug, Serialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct BookCheckoutResponse {
    #[schema(value_type = String)]
    pub id: CheckoutId,
    pub checked_out_by: CheckoutUser,
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

#[derive(Debug, Serialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct BookResponse {
    #[schema(value_type = String)]
    pub id: Uuid,
    pub title: String,
    pub author: String,
    pub isbn: String,
    pub description: String,
    pub owner: BookOwner,
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

#[derive(Debug, Serialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct PaginatedBookResponse {
    pub total: i64,
    pub limit: i64,
    pub offset: i64,
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
