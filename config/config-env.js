/* eslint-disable no-undef */
const dotenv = require('dotenv')

dotenv.config()


const env = process.env.NODE_ENV ?? 
if (process.env.NODE_ENV === 'production') {
  module.exports = {
    endpoint: process.env.PROD_API_URL,
    port: process.env.PORT || '3000',
    mongo_url: process.env.PROD_MONGODB_URL,
    db_mongo_host: process.env.PROD_MONGODB_URL,
    db_mongo_user: process.env.PROD_MONGODB_USER,
    db_mongo_password: process.env.PROD_MONGODB_PASSWORD,
    mongo_db_schema: process.env.MONGODB_NAME,
    accessKeyId: process.env.ID,
    secretAccessKey: process.env.SECRET
  }
} else if (process.env.NODE_ENV === 'uat') {
  module.exports = {
    endpoint: process.env.UAT_API_URL,
    port: process.env.PORT || '3000',
    mongo_url: process.env.UAT_MONGODB_URL,
    db_mongo_host: process.env.UAT_MONGODB_URL,
    db_mongo_user: process.env.UAT_MONGODB_USER,
    db_mongo_password: process.env.UAT_MONGODB_PASSWORD,
    mongo_db_schema: process.env.MONGODB_NAME,
    accessKeyId: process.env.ID,
    secretAccessKey: process.env.SECRET
  }
} else if (process.env.NODE_ENV === 'dev') {
  module.exports = {
    endpoint: process.env.DEV_API_URL,
    port: process.env.PORT || '3000',
    mongo_url: process.env.DEV_MONGODB_URL,
    db_mongo_host: process.env.DEV_MONGODB_URL,
    db_mongo_user: process.env.DEV_MONGODB_USER,
    db_mongo_password: process.env.DEV_MONGODB_PASSWORD,
    mongo_db_schema: process.env.MONGODB_NAME,
    accessKeyId: process.env.ID,
    secretAccessKey: process.env.SECRET
  }
} else if (process.env.NODE_ENV === 'local') {
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
} else if (process.env.NODE_ENV === 'test') {
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
}
