const express = require('express')
const cors = require('cors')
const { graphqlHTTP } = require('express-graphql')
const schema = require('./schema/schema')

const app = express()

app.use('/graphql', cors(), graphqlHTTP({ schema, graphiql: process.env.NODE_ENV === 'development' }))

app.listen(5000, () => {
    console.log('Server running on port 5000.')
})