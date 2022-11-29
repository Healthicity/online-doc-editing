'use strict'
const { Schema, model, Types } = require('mongoose')
const RoleSchema = require('./role.model')

const User = new Schema({
  _id: { type: Types.ObjectId, auto: true },
  firstName: String,
  lastName: String,
  email: String,
  roleId: { type: Types.ObjectId, ref: RoleSchema },
  password: String,
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

module.exports = model('users', User)
