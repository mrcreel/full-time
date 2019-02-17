const express = require('express')
const bodyParser = require('body-parser')
const graphQlHTTP = require('express-graphql')
const {buildSchema} = require('graphql')

const app = express()

const GRAPHQL_PORT =3000

app.use(bodyParser.json())

app.use('/graphql', graphQlHTTP({
  schema: buildSchema(`
    type Query{
      leagues: [String!]!
    }
    type Mutation{
      createLeague(name: String): String
    }
    schema{
      query: Query
      mutation: Mutation
    }
  `),
  rootValue: {
    leagues: () => {
      return [
        'Premier League',
        'Championship',
        'League One',
        'League Two',
      ]
    },
    createLeague: (args) => {
      const leagueName = args.name
      return leagueName
    }
  },
  graphiql: true
}))

app.listen(GRAPHQL_PORT)
