'use strict'
const { Schema, model, Types } = require('mongoose')
const UserSchema = require('./user.model')
const EditionSchema = require('./edition.model')

const Comment = new Schema({
  _id: { type: Types.ObjectId, auto: true },
  userId: { type: Types.ObjectId, ref: UserSchema },
  editionId: { type: Types.ObjectId, ref: EditionSchema },
  text: String,
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

module.exports = model('comments', Comment)
