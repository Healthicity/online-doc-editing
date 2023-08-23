const Joi = require('joi')

const defaultBucketName = process.env.S3_BUCKET || 'doc-api-bucket';


const uploadObjectSchema = Joi.object({
  bucketName: Joi.string().required().default(defaultBucketName),
  filename: Joi.string()
})

module.exports = uploadObjectSchema
