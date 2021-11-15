import { gql } from '@apollo/client'

export const GET_ALBUMS = gql`
    query {
        getAllAlbums{
            id
            artist{
                name
            }
            year
            title
            coverUrl
            artist{
                name
            }
            explicit
        }
    }
`

export const GET_ALBUM_BY_ID = gql`
    query($albumId: ID!) {
        getAlbumById(id: $albumId){
            id
            year
            title
            genres
            coverUrl
            artist{
                name
            }
            explicit
            songs{
                id
                title
                genre
                duration
                explicit
                album{
                    title
                }
                artist{
                    name
                }
            }
        }
    }
`

export const GET_RECOMMENDED_ALBUMS = gql`
    query {
        getRecommendedAlbums{
            id
            artist{
                name
            }
            year
            title
            coverUrl
            artist{
                name
            }
            explicit
        }
    }
`

export const ADD_FAVORITE_ALBUM = gql`
    mutation($albumId: String!) {
        addFavoriteAlbum(albumId: $albumId){
            id
        }
    }
`

export const REMOVE_FAVORITE_ALBUM = gql`
    mutation($albumId: String!) {
        removeFavoriteAlbum(albumId: $albumId){
            id
        }
    }
`