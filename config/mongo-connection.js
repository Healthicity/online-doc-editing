const mongoose = require('mongoose')

const dbConnection = mongoose.connect(process.env.LOCAL_MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

module.exports = dbConnection
