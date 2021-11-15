import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { GET_ALBUM_BY_ID } from '../../data/Albums'
import { GET_USER } from '../../data/User'
import { IGetAlbumByIdQuery, IGetUserQuery } from '../../types/Queries.types'
import styles from './SingleAlbum.module.css'
import { CollectionIcon, StarIcon } from '@heroicons/react/outline'
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs'
import FullPageError from '../../components/FullPageError/FullPageError'
import FullPageLoader from '../../components/FullPageLoader/FullPageLoader'
import TrackModal from './TrackModal'
import { ISong } from '../../types/Primitives.types'

const breadcrumbStack = [
    {
        label: 'Albums',
        path: '/albums',
        icon: <CollectionIcon className={styles.menuIcon} width={18} height={18}/>
    }
]

const Albums = () => {
    const [pageStatus, setPageStatus] = useState('initial')
    const [openedTrack, setOpenedTrack] = useState<ISong | undefined>()
    const { albumId } = useParams()
    
    const { error: userError, loading: userLoading, data: userData } = useQuery<IGetUserQuery>(GET_USER)
    const { error: albumError, loading: albumLoading, data: albumData } = useQuery<IGetAlbumByIdQuery>(GET_ALBUM_BY_ID, { variables: { albumId } })

    const user = userData?.getUser
    const album = albumData?.getAlbumById

    const isFavoriteAlbum = useCallback((albumId) => {
        return user?.favoriteAlbums?.find(favoriteAlbum => favoriteAlbum === albumId)
    }, [user?.favoriteAlbums])

    const handleTrackModal = useCallback((track) => {
        if (openedTrack || !track) {
            setOpenedTrack(undefined)
        }

        setOpenedTrack(track)
    }, [openedTrack, setOpenedTrack])
    
    useEffect(() => {
        if (userError || albumError) return setPageStatus('error')
        if (userLoading || albumLoading) return setPageStatus('loading')

        if (userData && albumData) return setPageStatus('ready')
        return setPageStatus('initial')
    }, [userLoading, userError, albumLoading, albumError])

    if (pageStatus === 'error') return <FullPageError/>
    if (pageStatus === 'loading') return <FullPageLoader/>

    if (pageStatus === 'ready') return (
        <div>
            <TrackModal
            open={openedTrack ? true : false}
            track={openedTrack}
            setOpen={handleTrackModal}
            />
            <Breadcrumbs
            routes={[...breadcrumbStack, { label: album?.title, path: `/albums/${album?.id}` }]}
            />
            <div className={styles.headerGrid}>
                <img
                src={album?.coverUrl}
                height={200}
                width={200}
                className={styles.albumCoverImage}
                />
                <div className={styles.albumInformationContainer}>
                    <div className={styles.albumTitleRow}>
                        <h2 className={styles.albumTitle}>
                            { album?.title }
                        </h2>
                        { album?.explicit && 
                            <span className={styles.explicitBadge}>
                                E
                            </span>
                        }
                    </div>
                    <h4 className={styles.albumDetails}>
                        { album?.artist?.name }
                    </h4>
                    <h5 className={styles.albumDetails}>
                        { album?.genres?.join(', ') } - { album?.year }
                    </h5>
                </div>
            </div>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead className={styles.tableHead}>
                        <th className={styles.tableHeader}>
                            Title
                        </th>
                        <th className={styles.tableHeader}>
                            Features
                        </th>
                        <th className={styles.tableHeader}>
                            Duration
                        </th>
                        <th className={`${ styles.tableHeader } ${ styles.smallTableUnit }`}>

                        </th>
                    </thead>
                    <tbody className={styles.tableBody}>
                        { album?.songs?.map(song => (
                                <tr
                                key={song.id}
                                className={styles.tableRow}
                                >
                                    <td
                                    className={styles.tableData}
                                    onClick={() => setOpenedTrack(song)}
                                    >
                                        <a>
                                            { song.title }
                                        </a>
                                    </td>
                                    <td className={styles.tableData}>
                                        { song.featuredArtists?.map(artist => artist.name).join(', ') }
                                    </td>
                                    <td className={styles.tableData}>
                                        { song.duration }
                                    </td>
                                    <td className={`${ styles.tableData } ${ styles.smallTableUnit }`}>
                                        { song.explicit && 
                                            <span className={styles.explicitBadge}>
                                                E
                                            </span>
                                        }
                                    </td>
                                </tr>
                        )) }
                    </tbody>
                </table>
            </div>
        </div>
    )

    return null
}

export default Albums
