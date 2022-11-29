const Joi = require('joi')

const allObjectsVersionsSchema = Joi.object({
  bucket: Joi.string().required(),
  prefix: Joi.string().empty().required().regex(/.*\.(docx|doc|pdf)$/, 'File upload extension')
})

module.exports = allObjectsVersionsSchema
