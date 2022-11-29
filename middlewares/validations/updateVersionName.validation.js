const Joi = require('joi')

const updateVersionName = Joi.object({
  versionId: Joi.string().required(),
  versionName: Joi.string().trim().required()
})

module.exports = updateVersionName
