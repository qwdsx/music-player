
use std::env;
use rocket::serde::json::Json;
use serde::Serialize;
use walkdir::WalkDir;
use audiotags::{Tag, Picture, MimeType};

use crate::music;

#[derive(Serialize)]
pub struct Song {
    id: usize,
    url: String,
    filename: String,
    title: String,
    tags: Option<Tags>
}

#[derive(Serialize)]
struct Tags {
    artist: Option<String>
}

#[get("/")]
pub fn songs() -> Json<Vec<Song>> {
    let music_folder = env::vars().find(|x| x.0 == "MUSIC_FOLDER").unwrap().1;
    let server_url = env::vars().find(|x| x.0 == "ROCKET_ADDRESS").unwrap().1;
    let server_url = format!("http://{}:8000", server_url);

    let mut songs = Vec::<Song>::new();
    for (i, entry) in WalkDir::new(&music_folder).follow_links(true).max_depth(1).into_iter().enumerate() {
        let file = entry.unwrap().into_path();
        if file.display().to_string() == music_folder {
            continue
        }

        let tags = Tag::new().read_from_path(&file);
        let tags: Option<Tags> = match tags {
            Ok(tags) => {
                Some(
                    Tags {
                        artist: match tags.artist() {
                            Some(artist) => Some(artist.to_string()),
                            None => None
                        }
                    }
                )
            },
            Err(_) => None
        };

        songs.push(
            Song {
                id: i,
                url: format!("{}{}", server_url, file.display().to_string().replacen(&music_folder, "", 1)),
                filename: file.file_name().unwrap().to_str().unwrap().to_string(),
                title: file.file_stem().unwrap().display().to_string(),
                tags: tags
            }
        );
    }

    songs.remove(0);
    songs.sort_by(|a, b| a.title.to_lowercase().cmp(&b.title.to_lowercase()));

    Json(songs)
}