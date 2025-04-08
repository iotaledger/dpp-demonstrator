use axum;
use dotenvy::dotenv;
use tokio::net::TcpListener;

mod config;
mod handlers;
mod routes;
mod services;

use crate::config::config::Config;

#[tokio::main]
async fn main() {
    dotenv().ok();

    let config = Config::from_env();

    let app = routes::create_router();
    println!("SERVER LISTENING...");

    let listener = TcpListener::bind(config.tcp_listner.clone()).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
