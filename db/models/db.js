const mongoose = require('mongoose')
const uri = require('../../config/config.json').mongouri

mongoose.connect(
  uri,
  {
    keepAlive: true
  }
)

// When successfully connected
mongoose.connection.once('connected', () => {
  console.log('-------------------------------------')
  console.log(`Mongoose/Null connection open`)
  console.log('-------------------------------------')
})

// If the connection throws an error
mongoose.connection.on('error', err => {
  console.log(`Mongoose/Null connection error: ${err}`)
})

// When the connection is disconnected
mongoose.connection.once('disconnected', () => {
  console.log(`Mongoose/Null connection disconnected`)
})

// If the Node process ends, close the Mongoose connection
process.once('SIGINT', () => {
  console.log('App terminated')
  mongoose.connection.close(() => process.exit(0))
})

require('./tag.js')
require('./weather.js')
