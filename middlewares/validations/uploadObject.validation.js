const Joi = require('joi')

const uploadObjectSchema = Joi.object({
  bucketName: Joi.string().required().default('doc-api-bucket'),
  filename: Joi.string()
})

module.exports = uploadObjectSchema
