const Joi = require('joi')

const getVersionByIdSchema = Joi.object({
  versionId: Joi.string().trim().required()
})

module.exports = getVersionByIdSchema
