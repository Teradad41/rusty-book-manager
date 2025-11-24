use axum::{Router, routing::post};
use registry::AppRegistry;

use crate::handler::auth::{login, logout};

pub fn build_auth_routes() -> Router<AppRegistry> {
    let routers = Router::new()
        .route("/login", post(login))
        .route("/logout", post(logout));

    Router::new().nest("/auth", routers)
}
