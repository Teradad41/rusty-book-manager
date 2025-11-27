use sqlx::types::chrono::{DateTime, Utc};

use crate::model::id::{BookId, CheckoutId};
use crate::model::user::CheckoutUser;

pub mod event;

#[derive(Debug)]
pub struct Checkout {
    pub id: CheckoutId,
    pub checked_out_by: CheckoutUser,
    pub checked_out_at: DateTime<Utc>,
    pub returned_at: Option<DateTime<Utc>>,
    pub book: CheckoutBook,
}

#[derive(Debug)]
pub struct CheckoutBook {
    pub book_id: BookId,
    pub title: String,
    pub author: String,
    pub isbn: String,
}
