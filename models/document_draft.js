'use strict'
const { Schema, model, Types } = require('mongoose')
const DocumentSchema = require('./document')
const User = require('./user')
const { Op } = require('sequelize')

const DocumentDraft = new Schema({
  _id: { type: Types.ObjectId, auto: true },
  bucket: String,
  filename: String,
  content_type: String,
  path: { type: String },
  record_id: Number,
  record_type: String,
  html: String,
  header: String,
  footer: String,
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
