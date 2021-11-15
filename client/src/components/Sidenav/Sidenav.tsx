import React, { useMemo } from 'react'
import { CollectionIcon, DatabaseIcon, StarIcon, StatusOnlineIcon } from '@heroicons/react/outline'
import { Link, useLocation } from 'react-router-dom'
import styles from './Sidenav.module.css'
import { IMenuItemProps } from '../../types/Navigation.types'
import capitalizeFirstLetter from '../../helpers/CapitalizeFirstLetter'

const routes = [
    {
        path: 'albums',
        icon: <CollectionIcon className={styles.menuIcon} width={18} height={18}/>
    }
]

const Sidenav = () => {
    const { pathname } = useLocation()

    const currentPath = pathname.split('/')[1]

    return (
        <div className={styles.container}>
            <div className={styles.logoContainer}>
                <span className={styles.logoRow}>
                    <StatusOnlineIcon
                    color='#7C3AED'
                    height={32}
                    width={32}
                    />
                    <h6 className={styles.logoText}>
                        musik
                    </h6>
                </span>
            </div>
            <nav className={styles.menuContainer}>
                { routes.map(route => (
                    <MenuItem 
                    key={route.path}
                    route={route}
                    current={route.path === currentPath}
                    />
                )) }
            </nav>
        </div>
    )
}

const MenuItem = ({ route, current }: IMenuItemProps) => {
    return (
        <Link
        to={route.path}
        className={current ? `${ styles.activeMenuItem } ${ styles.menuItem }`: `${ styles.inactiveMenuItem } ${ styles.menuItem }`}
        >
            { route.icon }
            { capitalizeFirstLetter(route.path) }
        </Link>
    )
}

export default Sidenav
