import { EmojiSadIcon } from '@heroicons/react/outline'
import React from 'react'
import styles from './FullPageError.module.css'

const FullPageError = () => {
    return (
        <div className={styles.container}>
            <EmojiSadIcon
            color='#7C3AED'
            height={64}
            width={64}
            />
            <h3 className={styles.errorText}>
                An error has occured. Please try again later.
            </h3>
        </div>
    )
}

export default FullPageError
