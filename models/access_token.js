'use strict'
const { Schema, model, Types } = require('mongoose')

const AccessToken = new Schema({
  _id: { type: Types.ObjectId, auto: true },
  user_id: Number,
  document_id: Types.ObjectId,
  token: String,
})

module.exports = model('access_tokens', AccessToken)
