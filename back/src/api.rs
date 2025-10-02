
use std::{env, path::PathBuf};
use rocket::serde::json::Json;
use serde::Serialize;
use walkdir::WalkDir;
use audiotags::{Tag, Picture, MimeType};


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
        let file_path = entry.unwrap().into_path();
        if file_path.display().to_string() == music_folder { continue }
        songs.push(
            Song {
                id: i,
                url: format!("{}{}", server_url, file_path.display().to_string().replacen(&music_folder, "", 1)),
                filename: file_path.file_name().unwrap().to_str().unwrap().to_string(),
                title: file_path.file_stem().unwrap().display().to_string(),
                tags: tags(&file_path)
            }
        );
    }

    songs.sort_by(|a, b| a.title.to_lowercase().cmp(&b.title.to_lowercase()));

    Json(songs)
}

fn tags(path: &PathBuf) -> Option<Tags> {
    let tags = Tag::new().read_from_path(&path);
    match tags {
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
    }
}