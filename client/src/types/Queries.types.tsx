import { ApolloError } from '@apollo/client'
import { IAlbum, IUser } from './Primitives.types'

export interface IQuery {
    error?: ApolloError
    loading: boolean
}

export interface IGetUserQuery extends IQuery {
    getUser: IUser
}

// Albums
export interface IGetAllAlbumsQuery extends IQuery {
    getAllAlbums: IAlbum[]
}

export interface IGetRecommendedAlbumsQuery extends IQuery {
    getRecommendedAlbums: IAlbum[]
}

export interface IGetAlbumByIdQuery extends IQuery {
    getAlbumById: IAlbum
}

// Artists

// Songs