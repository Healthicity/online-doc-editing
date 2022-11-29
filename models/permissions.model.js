'use strict'
const { Schema, model, Types } = require('mongoose')

const Permission = new Schema({
  _id: { type: Types.ObjectId, auto: true },
  type: String,
  code: Number,
  createdAt: {
    type: Date,
    default: () => new Date()
  },
  updatedAt: {
    type: Date,
    default: () => new Date()
  }
}, { timestamps: true })

module.exports = model('permissions', Permission)
