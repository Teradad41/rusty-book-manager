use axum::{
    Router,
    routing::{delete, get, put},
};
use registry::AppRegistry;

use crate::handler::user::{
    change_password, change_role, delete_user, get_checkouts, get_current_user, list_users,
    register_user,
};

pub fn build_user_router() -> Router<AppRegistry> {
    Router::new()
        .route("/users/me", get(get_current_user))
        .route("/users/me/checkouts", get(get_checkouts))
        .route("/users/me/password", put(change_password))
        .route("/users", get(list_users).post(register_user))
        .route("/users/{user_id}", delete(delete_user))
        .route("/users/{user_id}/role", put(change_role))
}
