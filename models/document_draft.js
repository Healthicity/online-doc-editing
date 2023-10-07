'use strict'
const { Schema, model, Types } = require('mongoose')
const DocumentSchema = require('./document')
const User = require('./user')
const { Op } = require('sequelize')

const DocumentDraft = new Schema({
  _id: { type: Types.ObjectId, auto: true },
  bucket: String,
  filename: String,
  path: { type: String },
  uploaded_document_revision_id: Number,
  content: Buffer,
  html: String,
  extension: String,
  lastModified: Date,
  contentLength: Number,
  etag: String,
  documentId: { type: Types.ObjectId, ref: DocumentSchema },
  userConfirmations: { type: Number, default: 0 },
  userIds: [Number]
}, { timestamps: true })

DocumentDraft.methods.populateUsers = async function () {
  return User.findAll({
    where: {
      id: {
        [Op.in]: this.userIds
      }
    }
  })
}
module.exports = model('document_drafts', DocumentDraft)
