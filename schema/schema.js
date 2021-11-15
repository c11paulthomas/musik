const graphql = require('graphql')
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLBoolean, GraphQLSchema, GraphQLNonNull } = graphql
const albums = require('../mock/albums.json')
const artists = require('../mock/artists.json')
const songs = require('../mock/songs.json')
const user = require('../mock/user.json')

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        favoriteAlbums: { type: new GraphQLList(GraphQLString) }
    })
})

const AlbumType = new GraphQLObjectType({
    name: 'Album',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        coverUrl: { type: GraphQLString },
        year: { type: GraphQLString },
        genres: {
            type: new GraphQLList(GraphQLString),
            resolve(parent, args) {
                return songs.reduce((acc, song) => {
                    if (song.albumId !== parent.id) return acc

                    if (acc.findIndex(existingGenre => existingGenre === song.genre) === -1) return [...acc, song.genre]

                    return acc
                }, [])
            }
        },
        artistId: { type: GraphQLID },
        artist: {
            type: ArtistType,
            resolve(parent, args) {
                return artists.find(artist => artist.id === parent.artistId)
            }
        },
        songs: {
            type: new GraphQLList(SongType),
            resolve(parent, args) {
                return songs.filter(song => song.albumId === parent.id)
            }
        },
        explicit: {
            type: GraphQLBoolean,
            resolve(parent, args) {
                return songs.findIndex(song => (song.albumId === parent.id && song.explicit === true)) > -1
            }
        }
    })
})

const ArtistType = new GraphQLObjectType({
    name: 'Artist',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genres: { type: new GraphQLList(GraphQLString) },
        albums: {
            type: new GraphQLList(AlbumType),
            resolve(parent, args) {
                return albums.filter(album => album.artistId === parent.id)
            }
        },
        songs: {
            type: new GraphQLList(SongType),
            resolve(parent, args) {
                return songs.filter(song => song.artistId === parent.id)
            }
        }
    })
})

const SongType = new GraphQLObjectType({
    name: 'Song',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        genre: { type: GraphQLString },
        duration: { type: GraphQLString },
        artistId: { type: GraphQLString },
        artist: {
            type: ArtistType,
            resolve(parent, args) {
                return artists.find(artist => artist.id === parent.artistId)
            }
        },
        explicit: { type: GraphQLBoolean },
        features: { type: new GraphQLList(GraphQLString) },
        featuredArtists: {
            type: new GraphQLList(ArtistType),
            resolve(parent, args) {
                return artists.filter(artist => parent?.features?.findIndex(feature => feature !== artist.id))
            }
        },
        albumId: { type: GraphQLString },
        album: {
            type: AlbumType,
            resolve(parent, args) {
                return albums.find(album => album.id === parent.albumId)
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        getUser: {
            type: UserType,
            resolve(parent, args) {
                return user
            }
        },
        getAllAlbums: {
            type: new GraphQLList(AlbumType),
            resolve(parent, args) {
                return albums
            }
        },
        getAlbumById: {
            type: AlbumType,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            resolve(parent, args) {
                return albums.find(album => album.id === args.id)
            }
        },
        getRecommendedAlbums: {
            type: new GraphQLList(AlbumType),
            resolve() {
                const recommendedArtists = albums.reduce((acc, album) => {
                    if (user.favoriteAlbums.findIndex(userAlbum => userAlbum === album.id) === -1) return acc

                    const albumFeatures = songs.filter(song => song.albumId === album.id && song.features)

                    // Combines album featured artists and album artist, then flattens the array to just an array of strings (Artist IDs)
                    const recommendedArtists = albumFeatures.map(song => song.features).concat(album.artistId).flat()

                    // Returns a unique list of featured artists on favorite albums
                    return acc.concat(recommendedArtists).filter((x, i, a) => a.indexOf(x) == i)
                }, [])

                const recommendedAlbums = albums.filter(album => {
                    // Filters out already favorited albums
                    if (user.favoriteAlbums.findIndex(favoriteAlbum => favoriteAlbum === album.id) !== -1) return false

                    // Returns album as "recommended" if it is created by a recommended artist
                    if (recommendedArtists.findIndex(artist => artist === album.artistId) > -1) return true

                    return false
                })
                
                return recommendedAlbums
            }
        },
        artists: {
            type: ArtistType,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            resolve(parent, args) {
                return artists.find(artist => artist.id === args.id)
            }
        },
        songs: {
            type: new GraphQLList(SongType),
            args: {
                id: {
                    type: GraphQLID
                }
            },
            resolve(parent, args) {
                if (args.id) return songs.find(song => song.id === args.id)

                return songs
            }
        },
    }
})

const RootMutation = new GraphQLObjectType({
    name: 'RootMutationType',
    fields: {
        addFavoriteAlbum: {
            type: AlbumType,
            args: {
                albumId: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                user.favoriteAlbums.push(args.albumId)

                return albums.find(album => album.id === args.albumId)
            }
        },
        removeFavoriteAlbum: {
            type: AlbumType,
            args: {
                albumId: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                user.favoriteAlbums = user.favoriteAlbums.filter(album => album !== args.albumId)

                return {
                    id: args.albumId
                }
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
})