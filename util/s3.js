const AWS = require('aws-sdk')
const { accessKeyId, secretAccessKey } = require('../config/config-env')

const s3 = new AWS.S3({
  accessKeyId,
  secretAccessKey
})

s3.config.update({ region: process.env.S3_REGION })

module.exports = s3
