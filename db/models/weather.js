const mongoose = require('mongoose')

const weatherSchema = new mongoose.Schema({
  userID: String,
  location: String
})

module.exports = mongoose.model('Weather', weatherSchema, 'weather')
