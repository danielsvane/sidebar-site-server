const { ApolloServer } = require('apollo-server')
const MongoClient = require('mongodb').MongoClient
const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')

const url = 'mongodb://localhost:27017'
const dbName = 'nanolink'

async function setup () {
  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  const db = client.db(dbName)

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: {
      db
    }
  })

  server.listen().then(({ url, subscriptionsUrl }) => {
    console.log(`Server ready at ${url}`)
    console.log(`Subscriptions ready at ${subscriptionsUrl}`)
  })
}

setup()
