use async_trait::async_trait;

// リポジトリインターフェース
#[async_trait]
pub trait HealthCheckRepository: Send + Sync {
    async fn check_db(&self) -> bool;
}
