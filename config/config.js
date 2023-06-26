const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  development: {
    username: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT // Replace with your preferred database dialect
  },
  test: {
    // Configuration for testing environment
  },
  production: {
    // Configuration for production environment
  }
};