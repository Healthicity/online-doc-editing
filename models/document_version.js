'use strict'
const { Schema, model, Types } = require('mongoose')
const DocumentSchema = require('./document')
const User = require('./user')
const { Op } = require('sequelize')

const DocumentVersion = new Schema({
  _id: { type: Types.ObjectId, auto: true },
  lastModified: Date,
  html: String,
  userId: Number,
  uploaded_document_revision_id: Number,
  documentId: { type: Types.ObjectId, ref: DocumentSchema }
}, { timestamps: true })

DocumentVersion.statics.findRecentVersions = async function (docId, versionLimit = 200) {
  return await this.find({ documentId: docId }, 'html lastModified _id userId')
    .sort({ lastModified: 'desc' })
    .limit(versionLimit)
}

DocumentVersion.methods.populateUser = async function () {
  return User.findAll({
    where: {
      id: {
        [Op.in]: [this.userId]
      }
    },
    raw: true
  })
}
module.exports = model('document_versions', DocumentVersion)
