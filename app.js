const express = require('express')
const bodyParser = require('body-parser')

const PORT =3000

const app = express()

app.use(bodyParser.json())

app.get('/', (req, res, next)=> {
  console.log(`Connected to localhost:${PORT}`)
  res.send('FULL-TIME')
})

app.listen(PORT)