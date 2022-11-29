const Joi = require('joi')

const uploadObjectSchema = Joi.object({
  bucketName: Joi.string().required().default(process.env.S3_BUCKET),
  filename: Joi.string()
})

module.exports = uploadObjectSchema
