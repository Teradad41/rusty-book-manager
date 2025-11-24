use redis::{AsyncTypedCommands, Client};
use shared::{config::RedisConfig, error::AppResult};

use crate::redis::model::{RedisKey, RedisValue};

pub mod model;

pub struct RedisClient {
    client: Client,
}

impl RedisClient {
    pub fn new(config: &RedisConfig) -> AppResult<Self> {
        let client = Client::open(format!("redis://{}:{}", config.host, config.port))?;
        Ok(Self { client })
    }

    pub async fn set_ex<T: RedisKey>(&self, key: &T, value: &T::Value, ttl: u64) -> AppResult<()> {
        let mut connection = self.client.get_multiplexed_async_connection().await?;
        connection.set_ex(key.inner(), value.inner(), ttl).await?;

        Ok(())
    }

    pub async fn get<T: RedisKey>(&self, key: &T) -> AppResult<Option<T::Value>> {
        let mut connection = self.client.get_multiplexed_async_connection().await?;
        let result: Option<String> = connection.get(key.inner()).await?;
        result.map(T::Value::try_from).transpose()
    }

    pub async fn delete<T: RedisKey>(&self, key: &T) -> AppResult<()> {
        let mut connection = self.client.get_multiplexed_async_connection().await?;
        connection.del(key.inner()).await?;
        Ok(())
    }

    pub async fn try_connect(&self) -> AppResult<()> {
        let _ = self.client.get_multiplexed_async_connection().await?;
        Ok(())
    }
}
