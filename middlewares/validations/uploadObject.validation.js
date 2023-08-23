const Joi = require('joi')

const defaultBucketName = process.env.S3_BUCKET || 'default-bucket-name';


const uploadObjectSchema = Joi.object({
  bucketName: Joi.string().required().default(defaultBucketName),
  filename: Joi.string()
})

module.exports = uploadObjectSchema
