use anyhow::Result;
use axum::http::StatusCode;
use axum::{Router, routing::get};
use std::net::{Ipv4Addr, SocketAddr};
use tokio::net::TcpListener;

pub async fn health_check() -> StatusCode {
    StatusCode::OK
}

#[tokio::main]
async fn main() -> Result<()> {
    let app = Router::new().route("/health", get(health_check));
    let addr = SocketAddr::new(Ipv4Addr::LOCALHOST.into(), 8080);
    let listener = TcpListener::bind(addr).await?;

    println!("Listening on {}", addr);
    Ok(axum::serve(listener, app).await?)
}

#[tokio::test]
async fn health_check_test() {
    let status_code = health_check().await;
    assert_eq!(StatusCode::OK, status_code);
}
