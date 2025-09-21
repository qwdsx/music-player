

export type Song = {
    id: number,
    filename: string,
    title: string,
    url: string,
    tags: Tags | null
}

export type Tags = {
    artist: string | null
}