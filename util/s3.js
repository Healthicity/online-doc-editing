const AWS = require('aws-sdk')
const { accessKeyId, secretAccessKey } = require('../config/configurations')

const s3 = new AWS.S3({
  accessKeyId,
  secretAccessKey
})

s3.config.update({ region: 'us-east-1' })

module.exports = s3
