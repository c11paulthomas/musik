import { ChevronRightIcon } from '@heroicons/react/outline'
import React from 'react'
import { Link } from 'react-router-dom'
import capitalizeFirstLetter from '../../helpers/CapitalizeFirstLetter'
import { IRouteObject } from '../../types/Navigation.types'
import styles from './Breadcrumbs.module.css'

interface IBreadcrumbsProps {
    routes: IRouteObject[]
}

const Breadcrumbs = ({ routes }: IBreadcrumbsProps) => {
    return (
        <nav className={styles.container}>
            <ol className={styles.listContainer}>
                { routes.map((route, index) => (
                    <li className={styles.listItem}>
                        <div className={styles.listItemRow}>
                            { index > 0 && 
                                <ChevronRightIcon
                                height={12}
                                width={12}
                                />                            
                            }
                            <Link
                            to={route.path}
                            className={styles.listItemLink}
                            >
                                { route.label ?? capitalizeFirstLetter(route.path) }
                            </Link>
                        </div>
                    </li>
                )) }
            </ol>
        </nav>
    )
}

export default Breadcrumbs
