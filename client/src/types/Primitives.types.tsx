export interface IUser {
    id: string
    favoriteAlbums?: string[]
}

export interface IAlbum {
    id: string
    title?: string
    coverUrl?: string
    year?: string
    genres?: string[]
    artist?: IArtist
    artistId?: string
    songs?: ISong[]
    explicit?: boolean
}

export interface IArtist {
    id: string
    name?: string
    genres?: string[]
    albums?: IAlbum[]
    songs?: ISong[]
}

export interface ISong {
    id: string
    title?: string
    genre?: string
    duration?: string
    artistId?: string
    artist?: IArtist
    explicit?: boolean
    featuredArtists?: IArtist[]
    albumId?: string
    album?: IAlbum
}