/* eslint-disable no-undef */
const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  port: process.env.PORT,
  dbPort: process.env.DB_PORT,
  dbHost: process.env.DB_HOST,
  dbUserName: process.env.DB_USER_NAME,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  dbDialect:  process.env.DB_DIALECT,
  endpoint: process.env.API_URL,
  accessKeyId: process.env.ID,
  secretAccessKey: process.env.SECRET
}
