const Joi = require('joi')

const allDeleteMarkersSchema = Joi.object({
  bucket: Joi.string().required()
})

module.exports = allDeleteMarkersSchema
