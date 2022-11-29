const Joi = require('joi')

const allObjectsSchema = Joi.object({
  bucket: Joi.string().required(),
  max: Joi.number().integer().positive().required().default(30)
})

module.exports = allObjectsSchema
