import React, { useCallback } from 'react'
import { ISong } from '../../types/Primitives.types'

interface TrackModalProps {
    open: boolean
    track?: ISong
    setOpen: (track?: ISong) => void
}

const TrackModal = ({ open, track, setOpen }: TrackModalProps) => {
    const closeTrack = useCallback(() => {
        setOpen()
    }, [])

    if (open) return (
        <div
        style={{position: 'fixed', width: '100vw', height: '100vh', top: 0, left: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.2)'}}
        onClick={closeTrack}
        >
            <div style={{display: 'flex', flexDirection: 'column', backgroundColor:'#FFFFFF', padding: 16, minWidth: 300,  borderRadius: 16}}>
                <h3>
                    { track?.title }
                </h3>
                <h5>
                    { track?.artist?.name }
                </h5>
                <h5>
                    { track?.album?.title }
                </h5>
                <h5>
                    { track?.genre }
                </h5>
                <h5>
                    { track?.duration }
                </h5>
            </div>
        </div>
    )

    return null
}

export default TrackModal
