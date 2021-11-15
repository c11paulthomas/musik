import { StatusOnlineIcon } from '@heroicons/react/outline'
import React from 'react'
import styles from './FullPageLoader.module.css'

const FullPageLoader = () => {
    return (
        <div className={styles.container}>
            <span className={styles.loadingIconContainer}>
                <StatusOnlineIcon
                color='#7C3AED'
                height={64}
                width={64}
                />
            </span>
            <h3 className={styles.loadingText}>
                Loading...
            </h3>
        </div>
    )
}

export default FullPageLoader
