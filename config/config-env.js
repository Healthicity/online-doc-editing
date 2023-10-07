/* eslint-disable no-undef */
const dotenv = require('dotenv')

dotenv.config()

if (process.env.NODE_ENV === 'test') {
  module.exports = {
    endpoint: process.env.LOCAL_API_URL,
    port: process.env.PORT || '3000',
    mongo_url: process.env.TEST_MONGODB_URL,
    db_mongo_host: process.env.TEST_MONGODB_URL,
    db_mongo_user: process.env.TEST_MONGODB_USER,
    db_mongo_password: process.env.TEST_MONGODB_PASSWORD,
    mongo_db_schema: process.env.MONGODB_NAME,
    accessKeyId: process.env.ID,
    secretAccessKey: process.env.SECRET
  }
} else {
  module.exports = {
    endpoint: process.env.LOCAL_API_URL,
    port: process.env.PORT || '3800',
    mongo_url: process.env.LOCAL_MONGODB_URL,
    db_mongo_host: process.env.LOCAL_MONGODB_URL,
    db_mongo_user: process.env.LOCAL_MONGODB_USER,
    db_mongo_password: process.env.LOCAL_MONGODB_PASSWORD,
    mongo_db_schema: process.env.MONGODB_NAME,
    accessKeyId: process.env.ID,
    secretAccessKey: process.env.SECRET
  }
}
