const mongoose = require('mongoose')

module.exports = collection => {
  const tagSchema = new mongoose.Schema({
    _id: String,
    content: String,
    userid: String,
    createdAt: { type: Date, default: new Date() },
    lastModified: { type: Date, default: new Date() },
    uses: { type: Number, default: 0 }
  })

  return mongoose.model(collection, tagSchema)
}
