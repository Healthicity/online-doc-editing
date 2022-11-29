'use strict'
const { Schema, model, Types } = require('mongoose')
const UserSchema = require('./user.model')
const DocumentSchema = require('./document.model')

const Edition = new Schema({
  _id: { type: Types.ObjectId, auto: true },
  documentDraftId: { type: Types.ObjectId, ref: DocumentSchema },
  content: Buffer,
  body: Object,
  userId: { type: Types.ObjectId, ref: UserSchema },
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

module.exports = model('editions', Edition)
