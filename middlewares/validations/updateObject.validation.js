const Joi = require('joi')

const updateObjectSchema = Joi.object({
  bucket: Joi.string().required(),
  key: Joi.string().required(),
  versionId: Joi.string().alphanum(),
  tag: Joi.string().alphanum().required()
})

module.exports = updateObjectSchema
