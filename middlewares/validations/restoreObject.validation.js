const Joi = require('joi')

const restoreObjectSchema = Joi.object({
  bucket: Joi.string().required(),
  key: Joi.string().required().regex(/.*\.(docx|doc|pdf)$/, 'File upload extension'),
  versionId: Joi.string().trim().required()
})

module.exports = restoreObjectSchema
