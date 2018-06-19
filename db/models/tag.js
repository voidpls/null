const mongoose = require('mongoose')

const uri =
  'mongodb+srv://admin:PAqOWfFhGkjwtWdx@null-reos2.mongodb.net/Tags?retryWrites=true'
mongoose.connect(uri)

// When successfully connected
mongoose.connection.on('connected', () => {
  console.log('-------------------------------------')
  console.log('Mongoose connection open to ' + uri)
  console.log('-------------------------------------')
})

// If the connection throws an error
mongoose.connection.on('error', err => {
  console.log('Mongoose connection error: ' + err)
})

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection disconnected')
})

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  console.log('App terminated')
  mongoose.connection.close(() => process.exit(0))
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

module.exports = mongoose.model('Tag', tagSchema)
