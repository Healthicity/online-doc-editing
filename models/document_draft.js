'use strict'
const { Schema, model, Types } = require('mongoose')
const StateSchema = require('./state')
const DocumentSchema = require('./document')
const User = require('./user')
const { Op } = require("sequelize");

const DocumentDraft = new Schema({
  _id: { type: Types.ObjectId, auto: true },
  bucket: String,
  filename: String,
  path: { type: String, unique: true },
  content: Buffer,
  body: Object,
  extension: String,
  lastModified: Date,
  contentLength: Number,
  etag: String,
  stateId: { type: Schema.Types.ObjectId, ref: StateSchema },
  documentId: { type: Types.ObjectId, ref: DocumentSchema },
  userConfirmations: { type: Number, default: 0 },
  userIds: [Number],
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

DocumentDraft.methods.populateUsers = async function() {
  return User.findAll({
    where: {
      id: {
        [Op.in]: this.userIds
      }
    }
  })
}
module.exports = model('document_drafts', DocumentDraft)
