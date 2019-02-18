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
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

module.exports = mongoose.model('League', leagueSchema)
