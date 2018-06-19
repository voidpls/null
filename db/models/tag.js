const mongoose = require('mongoose')
const tagsConfig = require('../../config/config.json').mongodb.tags

const tagConn = mongoose.createConnection(tagsConfig.uri, {
    keepAlive: true
})

// When successfully connected
tagConn.on('connected', () => {
  console.log('-------------------------------------')
  console.log(`Mongoose/${tagsConfig.name} connection open`)
  console.log('-------------------------------------')
})

// If the connection throws an error
tagConn.on('error', err => {
  console.log(`Mongoose/${tagsConfig.name} connection error: ${err}` )
})

// When the connection is disconnected
tagConn.on('disconnected', () => {
  console.log(`Mongoose/${tagsConfig.name} connection to disconnected`)
})

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  console.log('App terminated')
  tagConn.close(() => process.exit(0))
})

const tagSchema = new mongoose.Schema({
  tagname: String,
  content: String,
  userID: String,
  guildID: String,
  createdAt: { type: Date, default: new Date() },
  lastModified: { type: Date, default: new Date() },
  uses: { type: Number, default: 0 }
})

module.exports = tagConn.model('Tag', tagSchema)
