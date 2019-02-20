/* eslint-disable no-console */
const express = require('express')
const bodyParser = require('body-parser')
const graphQlHTTP = require('express-graphql')
const { buildSchema } = require('graphql')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const League = require('./models/league')
const User = require('./models/user')

const app = express()

app.use(bodyParser.json())

app.use('/graphql',
  graphQlHTTP({
    schema: buildSchema(`
      type League{
        _id: ID!
        name: String!
        tier: Int!
        creator: String!
        createdDateTime: String!
      }
      type User{
        _id: ID!
        userName: String!
        password: String
        authLevel: Int!
        createdDateTime: String!
      }

      input LeagueInput{
        name:String!
        tier: Int!
      }
      input UserInput{
        userName: String!
        password: String!
        authLevel: Int!
      }

      type Query{
        leagues: [League!]!
        users: [User!]!
      }
      type Mutation{
        createLeague(leagueInput: LeagueInput): League
        createUser(userInput: UserInput): User
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
          creator: `5c6cc1f260bb0736b8d4144e`,
          createdDateTime: new Date().toISOString()
        })
        let createdLeague
        return league
          .save()
          .then(result => {
            createdLeague = { ...result._doc, _id: result.id }
            console.log(result)
            return User.findById(`5c6ccbac0220e34e39193f98`)
          })
          .then(user => {
            if (!user) {
              throw new Error(`Username doesn't exist`)
            }
            user.createdLeagues.push(league)
            user.save()
          })
          .then(result => {
            return createdLeague
          })
          .catch(err => {
            console.log(err)
            throw err
          })
      },
      users: () => {
        return User.find()
          .then(users => {
            return users.map(user => {
              return {
                ...user._doc,
                _id: user.id,
                password: null,
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
      createUser: (args) => {
        return User.findOne({ userName: args.userInput.userName })
          .then(user => {
            if (user) {
              throw new Error(`Username already exists`)
            }
            return bcrypt.hash(args.userInput.password, 12)
          })
          .then(hashedPassword => {
            const user = new User({
              userName: args.userInput.userName,
              password: hashedPassword,
              authLevel: +args.userInput.authLevel,
              createdDateTime: new Date().toIsoString()
            })
            console.log(user)
            return user.save()
          })
          .then(result => {
            return {
              ...result._doc,
              _id: result.id,
              password: null,
            }
          })
          .catch(err => {
            console.log(err)
            throw err
          })
      }
    },
    graphiql: true,
  })
)

mongoose.connect(
  `
  mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-dxekj.mongodb.net/${process.env.MONGO_DB}?retryWrites=true
  `
  , { useNewUrlParser: true }
).then(() => {
  app.listen(process.env.GRAPHQL_PORT)
  console.log(`Listening on Port ${process.env.GRAPHQL_PORT}`)
}).catch(err => {
  console.log(err)
  throw err
})
