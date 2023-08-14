'use strict'
const { Schema, model, Types } = require('mongoose')

const AuthenticationToken = new Schema({
  _id: { type: Types.ObjectId, auto: true },
  token: String,
  createdAt: {
    type: Date,
    immutable: true,
    default: () => new Date()
  },
  updatedAt: {
    type: Date,
    default: () => new Date()
  }
}, { timestamps: true })

module.exports = model('authentication_tokens', AuthenticationToken)
