use chrono::{DateTime, Utc};
use kernel::model::{
    checkout::{Checkout, CheckoutBook},
    id::{BookId, CheckoutId},
};
use serde::Serialize;
use utoipa::ToSchema;

use crate::model::user::CheckoutUser;

#[derive(Serialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CheckoutsResponse {
    pub items: Vec<CheckoutResponse>,
}

impl From<Vec<Checkout>> for CheckoutsResponse {
    fn from(value: Vec<Checkout>) -> Self {
        Self {
            items: value.into_iter().map(CheckoutResponse::from).collect(),
        }
    }
}

#[derive(Serialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CheckoutResponse {
    #[schema(value_type = String)]
    pub id: CheckoutId,
    pub checked_out_by: CheckoutUser,
    pub checked_out_at: DateTime<Utc>,
    pub returned_at: Option<DateTime<Utc>>,
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

#[derive(Serialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CheckoutBookResponse {
    #[schema(value_type = String)]
    pub id: BookId,
    pub title: String,
    pub author: String,
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
