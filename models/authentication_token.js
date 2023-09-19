'use strict'
const { Schema, model, Types } = require('mongoose')

const AuthenticationToken = new Schema({
  _id: { type: Types.ObjectId, auto: true },
  token: String
}, { timestamps: true })

module.exports = model('authentication_tokens', AuthenticationToken)
