
const app = require("../index")
const supertest = require("supertest")
const { expect } = require("@jest/globals")
 
const request = supertest(app)
const baseUrl = '/graphql'

describe('User query', () => {
    it('should return a single user with valid data', (done) => {
        const query = `{
            getUser {
                id
                favoriteAlbums
            }
        }`
        request.post(baseUrl).send({query})
        .expect(200)
        .end((err, res) => {
            if (err) return done(err)
            expect(res.body).toBeInstanceOf(Object)
            expect(res.body.data.getUser.id).toBe("1")
            expect(res.body.data.getUser.favoriteAlbums.length).toBe(0)
            done()
        })
    })
})

describe('Album query', () => {
    it('should return a list of all albums with correct data', (done) => {
        const query = `{
            getAllAlbums{
                id
                year
                title
                coverUrl
                artist{
                    name
                }
                explicit
            }
        }`
        request.post(baseUrl).send({query})
        .expect(200)
        .end((err, res) => {
            if (err) return done(err)
            expect(res.body).toBeInstanceOf(Object)

            const albums = res.body.data.getAllAlbums
            expect(albums.length).toBeGreaterThanOrEqual(5)
            expect(albums[0].id).toBe('1')
            expect(albums[0].artist.name).toBe("DROELOE")
            expect(albums[0].year).toBe("2019")
            expect(albums[0].title).toBe("A Promise Is Made")
            expect(typeof albums[0].coverUrl).toBe('string')
            expect(albums[0].explicit).toBe(true)
            done()
        })
    })

    it('should return a single album with correct data', (done) => {
        const query = `{
            getAlbumById(id: 1){
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
        }`
        request.post(baseUrl).send({query})
        .expect(200)
        .end((err, res) => {
            if (err) return done(err)
            expect(res.body).toBeInstanceOf(Object)

            const album = res.body.data.getAlbumById
            expect(album.id).toBe("1")
            expect(album.year).toBe("2019")
            expect(album.title).toBe("A Promise Is Made")
            expect(album.genres.length).toBeGreaterThanOrEqual(1)
            expect(typeof album.coverUrl).toBe('string')
            expect(album.artist.name).toBe('DROELOE')
            expect(album.explicit).toBe(true)
            expect(album.songs.length).toBeGreaterThanOrEqual(5)

            const song = album.songs[0]
            expect(song.id).toBe("1")
            expect(song.title).toBe("Oath")
            expect(song.genre).toBe("Electronic")
            expect(song.duration).toBe("2:26")
            expect(song.explicit).toBe(null)
            expect(song.album.title).toBe("A Promise Is Made")
            expect(song.artist.name).toBe("DROELOE")
            done()
        })
    })
})

describe('Artist query', () => {
    it('should return an artist with correct data', (done) => {
        const query = `{
            artists(id: 1){
                id
                name
            }
        }`
        request.post(baseUrl).send({query})
        .expect(200)
        .end((err, res) => {
            if (err) return done(err)
            expect(res.body).toBeInstanceOf(Object)

            const artist = res.body.data.artists
            expect(artist.id).toBe('1')
            expect(artist.name).toBe("DROELOE")
            done()
        })
    })
})

describe('Song query', () => {
    it('should return a list of all songs with correct data', (done) => {
        const query = `{
            songs{
                id
                title
                genre
                duration
                artistId
                artist{
                    name
                }
                explicit
                features
                featuredArtists{
                    name
                }
                albumId
                album{
                    title
                }
            }
        }`
        request.post(baseUrl).send({query})
        .expect(200)
        .end((err, res) => {
            if (err) return done(err)
            expect(res.body).toBeInstanceOf(Object)

            const songs = res.body.data.songs

            console.log(songs)
            expect(songs.length).toBeGreaterThanOrEqual(30)
            expect(songs[0].id).toBe("1")
            expect(songs[0].title).toBe("Oath")
            expect(songs[0].duration).toBe("2:26")
            expect(songs[0].artistId).toBe("1")
            expect(songs[0].artist.name).toBe("DROELOE")
            expect(songs[0].explicit).toBe(null)
            expect(songs[3].features.length).toBe(1)
            expect(songs[3].featuredArtists.length).toBe(1)
            expect(songs[3].featuredArtists[0].name).toBe("Kalalu")
            expect(songs[0].albumId).toBe('1')
            expect(songs[0].album.title).toBe('A Promise Is Made')
            done()
        })
    })
})