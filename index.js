const express = require('express')
const cors = require('cors')
const path = require('path')
const { graphqlHTTP } = require('express-graphql')
const schema = require('./schema/schema')

const app = express()

app.use(express.static(path.join(__dirname, '/client/build')))

app.use('/graphql', cors(), graphqlHTTP({ schema, graphiql: process.env.NODE_ENV === 'development' }))

app.listen(5000, () => {
    console.log('Server running on port 5000.')
})

// Default Routing
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build/index.html'), function (err) {
        if (err) {
            res.status(500).send(err)
        }
    })
})