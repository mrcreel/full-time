const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
  userName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  authLevel: {
    type: Number,
    required: true
  },
  createdDateTime: {
    type: Date,
    required: true
  },
  createdLeagues: [
    {
      type: Schema.Types.ObjectId,
      ref: 'League'
    }
  ]
})

module.exports = mongoose.model('User', userSchema)
