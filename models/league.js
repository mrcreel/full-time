const mongoose = require('mongoose')

const Schema = mongoose.Schema

const leagueSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  tier: {
    type: Number,
    required: true
  },
  createdDateTime: {
    type: Date,
    required: true
  }
})

module.exports = mongoose.model('League', leagueSchema)
