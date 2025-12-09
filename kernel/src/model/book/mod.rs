use crate::model::{
    id::{BookId, CheckoutId, UserId},
    user::{BookOwner, CheckoutUser},
};
use sqlx::types::chrono::{DateTime, Utc};
use uuid::Uuid;

pub mod event;

#[derive(Debug)]
pub struct Book {
    pub id: Uuid,
    pub title: String,
    pub author: String,
    pub isbn: String,
    pub description: String,
    pub owner: BookOwner,
    pub checkout: Option<Checkout>,
}

#[derive(Debug)]
pub struct BookListOptions {
    pub limit: i64,
    pub offset: i64,
}

pub struct CreateBook {
    pub title: String,
    pub author: String,
    pub isbn: String,
    pub description: String,
}

#[derive(Debug)]
pub struct UpdateBook {
    pub book_id: BookId,
    pub title: String,
    pub author: String,
    pub isbn: String,
    pub description: String,
    pub requested_user: UserId,
    pub is_admin: bool,
}

#[derive(Debug)]
pub struct DeleteBook {
    pub book_id: BookId,
    pub requested_user: UserId,
    pub is_admin: bool,
}

#[derive(Debug)]
pub struct Checkout {
    pub checkout_id: CheckoutId,
    pub checked_out_by: CheckoutUser,
    pub checked_out_at: DateTime<Utc>,
}
