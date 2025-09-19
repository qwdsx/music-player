
use std::env;
use rocket::{fs::FileServer, http::Method};
use rocket_cors::{ Cors, AllowedOrigins, CorsOptions, AllowedHeaders };
use dotenv::*;

mod music;
use music::*;

#[macro_use] extern crate rocket;
fn make_cors() -> Cors {
    let server_url_env: String = env::vars().find(|x| x.0 == "ROCKET_ADDRESS").unwrap().1;
    let allowed_origins = AllowedOrigins::some_exact(&[
        "http://localhost:4200",
        "http://127.0.0.1:4200",
        "http://0.0.0.0:4200",
        &format!("http://{}:4200", server_url_env)
    ]);

    // let allowed_origins = AllowedOrigins::all();

    CorsOptions {
        allowed_origins,
        allowed_methods: vec![Method::Get]
            .into_iter()
            .map(From::from)
            .collect(),
        allowed_headers: AllowedHeaders::some(&[
            "Authorization",
            "Accept",
            "Access-Control-Allow-Origin"
        ]),
        allow_credentials: true,
        ..Default::default()
    }
    .to_cors()
    .expect("error while building CORS")
}

#[launch]
fn rocket() -> _ {
    dotenv().ok();
    let music_folder = env::vars().find(|x| x.0 == "MUSIC_FOLDER").unwrap().1;
    rocket::build()
        .configure(rocket::Config::figment())
        .mount("/", routes![songs])
        .mount("/", FileServer::from(music_folder))
        .attach(make_cors())
}
