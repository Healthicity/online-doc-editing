'use strict'
const { Schema, model, Types } = require('mongoose')
const PermissionSchema = require('./permissions.model')

const Role = new Schema({
  _id: { type: Types.ObjectId, auto: true },
  permissions: [{ type: Types.ObjectId, ref: PermissionSchema }],
  type: String,
  code: Number,
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

module.exports = model('roles', Role)
