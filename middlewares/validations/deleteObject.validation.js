const Joi = require('joi')

const deleteObjectSchema = Joi.object({
  bucket: Joi.string().required(),
  key: Joi.string().required().regex(/.*\.(docx|doc|pdf)$/, 'File upload extension'),
  versionId: Joi.string().trim(),
  toRestore: Joi.boolean().default(false)
})

module.exports = deleteObjectSchema
