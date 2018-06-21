const mongoose = require('mongoose')

const tagSchema = new mongoose.Schema({
  tagname: String,
  content: String,
  userID: String,
  guildID: String,
  createdAt: Date,
  lastModified: { type: Date, default: new Date() },
  uses: { type: Number, default: 0 }
})

module.exports = mongoose.model('Tag', tagSchema)
