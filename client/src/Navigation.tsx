import React from 'react'
import { Outlet, useRoutes } from 'react-router'
import Albums from './pages/Albums/Albums'
import SingleAlbum from './pages/Albums/SingleAlbum'
import TrackModal from './pages/Albums/TrackModal'

const Navigation = () => {
    const routes = [
        {
            path: 'albums',
            element: <Outlet/>,
            children: [
                {
                    path: '',
                    element: <Albums/>
                },
                {
                    path: ':albumId',
                    element: <SingleAlbum/>
                }
            ]
        }
    ]
    
    const routing = useRoutes(routes)

    return (
        <div style={styles.container}>
            { routing }
        </div>
    )
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        flex: 1,
        padding: 24,
        overflow: 'auto'
    }
}

export default Navigation
