use async_trait::async_trait;
use shared::error::AppResult;

use crate::model::{
    checkout::{
        Checkout,
        event::{CreateCheckout, UpdateReturned},
    },
    id::{BookId, UserId},
};

#[mockall::automock]
#[async_trait]
pub trait CheckoutRepository: Send + Sync {
    // 貸出登録
    async fn create(&self, event: CreateCheckout) -> AppResult<()>;
    // 返却
    async fn update_returned(&self, event: UpdateReturned) -> AppResult<()>;
    // 未返却一覧
    async fn find_unreturned_all(&self) -> AppResult<Vec<Checkout>>;
    // ユーザーID に紐づく未返却の貸出情報を取得
    async fn find_unreturned_by_user_id(&self, user_id: UserId) -> AppResult<Vec<Checkout>>;
    // 蔵書の貸出履歴
    async fn find_history_by_book_id(&self, book_id: BookId) -> AppResult<Vec<Checkout>>;
}
