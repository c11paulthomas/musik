import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery } from '@apollo/client'
import { ADD_FAVORITE_ALBUM, GET_ALBUMS, GET_RECOMMENDED_ALBUMS, REMOVE_FAVORITE_ALBUM } from '../../data/Albums'
import { GET_USER } from '../../data/User'
import { IGetAllAlbumsQuery, IGetRecommendedAlbumsQuery, IGetUserQuery } from '../../types/Queries.types'
import styles from './Albums.module.css'
import { StarIcon } from '@heroicons/react/outline'
import FullPageLoader from '../../components/FullPageLoader/FullPageLoader'
import FullPageError from '../../components/FullPageError/FullPageError'

const Albums = () => {
    const [pageStatus, setPageStatus] = useState('initial')
    const { error: userError, loading: userLoading, data: userData } = useQuery<IGetUserQuery>(GET_USER)
    const { error: albumsError, loading: albumsLoading, data: albumsData } = useQuery<IGetAllAlbumsQuery>(GET_ALBUMS)
    const { error: recommendedAlbumsError, loading: recommendedAlbumsLoading, data: recommendedAlbumsData, refetch: refetchRecommendedAlbums } = useQuery<IGetRecommendedAlbumsQuery>(GET_RECOMMENDED_ALBUMS)
    const [addFavoriteAlbum] = useMutation(ADD_FAVORITE_ALBUM, {
        update(cache, { data: { addFavoriteAlbum } }) {
            const userData = cache.readQuery<IGetUserQuery>({ query: GET_USER })

            cache.writeQuery({
                query: GET_USER,
                data: { getUser: userData?.getUser?.favoriteAlbums?.concat(addFavoriteAlbum.id) }
            })

            refetchRecommendedAlbums()
        }
    })
    const [removeFavoriteAlbum] = useMutation(REMOVE_FAVORITE_ALBUM, {
        update(cache, { data: { removeFavoriteAlbum } }) {
            const userData = cache.readQuery<IGetUserQuery>({ query: GET_USER })

            cache.writeQuery({
                query: GET_USER,
                data: { getUser: userData?.getUser?.favoriteAlbums?.concat(removeFavoriteAlbum.id) }
            })

            refetchRecommendedAlbums()
        }
    })

    const user = userData?.getUser
    const albums = albumsData?.getAllAlbums
    const recommendedAlbums = recommendedAlbumsData?.getRecommendedAlbums

    const isFavoriteAlbum = useCallback((albumId) => {
        return user?.favoriteAlbums?.find(favoriteAlbum => favoriteAlbum === albumId)
    }, [user?.favoriteAlbums])

    useEffect(() => {
        if (userError || albumsError || recommendedAlbumsError) return setPageStatus('error')
        if (userLoading || albumsLoading) return setPageStatus('loading')

        if (userData && albumsData) return setPageStatus('ready')
        return setPageStatus('initial')
    }, [userLoading, userError, albumsLoading, albumsError])

    if (pageStatus === 'error') return <FullPageError/>
    if (pageStatus === 'loading') return <FullPageLoader/>

    if (pageStatus === 'ready') return (
        <div>
            <h3>
                Recommended Albums
            </h3>
            { recommendedAlbums && recommendedAlbums.length > 0 ?
                <ul className={styles.albumGrid}>
                    { recommendedAlbums?.map(album => (
                        <div
                        className={styles.albumContainer}
                        >
                            <img
                            src={album.coverUrl}
                            className={styles.albumCoverImage}
                            />
                            <StarIcon
                            onClick={() => isFavoriteAlbum(album.id) ? removeFavoriteAlbum({ variables: { albumId: album.id } }) : addFavoriteAlbum({ variables: { albumId: album.id }})}
                            fill={isFavoriteAlbum(album.id) && '#FDE68A'}
                            fillOpacity={isFavoriteAlbum(album.id) ? 1 : 0}
                            color={isFavoriteAlbum(album.id) ? '#FCD34D' : '#FFFFFF'}
                            width={24}
                            height={24}
                            className={styles.favoriteIcon}
                            />
                            <Link
                            to={`/albums/${album.id}`}
                            className={styles.albumInfoContainer}>
                                <div className={styles.albumTitleRow}>
                                    <h5>
                                        { album.title }
                                    </h5>
                                    { album.explicit &&
                                        <span className={styles.explicitBadge}>
                                            E
                                        </span>
                                    }
                                </div>
                                <h5 className={styles.albumArtist}>
                                    { album.artist?.name }
                                </h5>
                                <p className={styles.albumYear}>
                                    { album.year }
                                </p>
                            </Link>
                        </div>
                    )) }
                </ul>
                :
                <div className={styles.recommendedSuggestion}>
                    <StarIcon
                    color='#7C3AED'
                    height={64}
                    width={64}
                    />
                    <h3 className={styles.recommendedText}>
                        You currently don't have any recommended albums. Favorite some more albums!
                    </h3>
                </div>
            }
            <h3>
                All Albums
            </h3>
            <ul className={styles.albumGrid}>
                { albums?.map(album => (
                    <div
                    className={styles.albumContainer}
                    >
                        <img
                        src={album.coverUrl}
                        className={styles.albumCoverImage}
                        />
                        <StarIcon
                        onClick={() => isFavoriteAlbum(album.id) ? removeFavoriteAlbum({ variables: { albumId: album.id } }) : addFavoriteAlbum({ variables: { albumId: album.id }})}
                        fill={isFavoriteAlbum(album.id) && '#FDE68A'}
                        fillOpacity={isFavoriteAlbum(album.id) ? 1 : 0}
                        color={isFavoriteAlbum(album.id) ? '#FCD34D' : '#FFFFFF'}
                        width={24}
                        height={24}
                        className={styles.favoriteIcon}
                        />
                        <Link
                        to={`/albums/${album.id}`}
                        className={styles.albumInfoContainer}
                        >
                            <div className={styles.albumTitleRow}>
                                <h5>
                                    { album.title }
                                </h5>
                                { album.explicit &&
                                    <span className={styles.explicitBadge}>
                                        E
                                    </span>
                                }
                            </div>
                            <h5 className={styles.albumArtist}>
                                { album.artist?.name }
                            </h5>
                            <p className={styles.albumYear}>
                                { album.year }
                            </p>
                        </Link>
                    </div>
                )) }
            </ul>
        </div>
    )

    return null
}

export default Albums
