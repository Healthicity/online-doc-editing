const Joi = require('joi')

const oneObjectVersionSchema = Joi.object({
  bucket: Joi.string().required(),
  key: Joi.string().empty().required().regex(/.*\.(docx|doc|pdf)$/, 'File upload extension'),
  versionId: Joi.string().trim()
})

module.exports = oneObjectVersionSchema
