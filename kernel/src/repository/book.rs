use async_trait::async_trait;
use shared::error::AppResult;
use uuid::Uuid;

use crate::model::book::{Book, event::CreateBook};

#[async_trait]
pub trait BookRepository: Send + Sync {
    async fn create(&self, event: CreateBook) -> AppResult<()>;
    async fn find_all(&self) -> AppResult<Vec<Book>>;
    async fn find_by_id(&self, book_id: Uuid) -> AppResult<Option<Book>>;
}
