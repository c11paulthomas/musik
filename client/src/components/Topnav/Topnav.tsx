import { SearchIcon } from '@heroicons/react/outline'
import React from 'react'
import styles from './Topnav.module.css'

const Topnav = () => {
    return (
        <div className={styles.container}>
            <form className={styles.form}>
                <SearchIcon
                color='#9CA3AF'
                height={18}
                width={18}
                />
                <input
                className={styles.searchInput}
                placeholder='Search'
                />
            </form>
        </div>
    )
}

export default Topnav
