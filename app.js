/* eslint-disable no-console */
const express = require('express')
const bodyParser = require('body-parser')
const graphQlHTTP = require('express-graphql')
const { buildSchema } = require('graphql')
const mongoose = require('mongoose')

const League = require('./models/league')

const app = express()

app.use(bodyParser.json())

app.use('/graphql',
  graphQlHTTP({
    schema: buildSchema(`
    "_id is autogenerated"
      type League{
        _id: ID!
        name: String!
        tier: Int!
        createdDateTime: String!
      }

      input LeagueInput{
        name:String!
        tier: Int!
        createdDateTime: String!
      }

      type Query{
        "A list of saved leagues"
        leagues: [League!]!
      }
      type Mutation{
        createLeague(leagueInput: LeagueInput): League
      }

      schema{
        query: Query
        mutation: Mutation
      }
    `),
    rootValue: {
      leagues: () => {
        return League.find()
          .then(leagues => {
            return leagues.map(league => {
              return {
                ...league._doc,
                _id: league.id,
              }
            }
            )
          }).catch(
            err => {
              console.log(err)
              throw err
            }
          )
      },
      createLeague: (args) => {
        const league = new League({
          name: args.leagueInput.name,
          tier: +args.leagueInput.tier,
          createdDateTime: new Date(args.leagueInput.createdDateTime),
        })
        return league
          .save()
          .then(result => {
            console.log(result)
            return {
              ...result._doc,
              _id: result.id,
            }
          })
          .catch(err => {
            console.log(err)
            throw err
          })
      },
    },
    graphiql: true,
  })
)

mongoose.connect(
  `
  mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-dxekj.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`
  , { useNewUrlParser: true }
).then(() => {
  app.listen(process.env.GRAPHQL_PORT)
}).catch(err => {
  console.log(err)
})
