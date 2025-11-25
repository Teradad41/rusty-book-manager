use axum::{
    Router,
    routing::{get, post},
};
use registry::AppRegistry;

use crate::handler::book::{register_book, show_book, show_book_list};

pub fn build_book_routes() -> Router<AppRegistry> {
    let routers = Router::new()
        .route("/", post(register_book))
        .route("/", get(show_book_list))
        .route("/{book_id}", get(show_book));

    Router::new().nest("/books", routers)
}
