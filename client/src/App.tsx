import React from 'react'
import './reset.css'
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import Navigation from './Navigation'
import Sidenav from './components/Sidenav/Sidenav'
import Topnav from './components/Topnav/Topnav'

const httpLink = createHttpLink({ uri: '/graphql' })

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
})

function App() {
    return (
        <ApolloProvider client={client}>
            <BrowserRouter>
                <div style={styles.container}>
                    <Sidenav/>
                    <div style={styles.rootContainer}>
                        <Topnav/>
                        <Navigation/>
                    </div>
                </div>
            </BrowserRouter>
        </ApolloProvider>
    )
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'grid',
        gridTemplateColumns: '2fr 10fr',
        minHeight: '100vh'
    },
    rootContainer: {
        display: 'flex',
        flexDirection: 'column'
    }
}

export default App
