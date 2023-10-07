'use strict'
const { Schema, model, Types } = require('mongoose')
const DocumentSchema = require('./document')
const User = require('./user')
const { Op } = require('sequelize')

const DocumentVersion = new Schema({
  _id: { type: Types.ObjectId, auto: true },
  etag: String,
  isLatest: { type: Boolean, default: false },
  lastModified: Date,
  versionId: { type: String },
  body: Object,
  content: Buffer,
  html: String,
  versionName: { type: String, default: '' },
  userId: Number,
  documentId: { type: Types.ObjectId, ref: DocumentSchema }
}, { timestamps: true })

DocumentVersion.statics.findByDocId = async function (docId, versionLimit) {
  return await this.find({ documentId: docId, isLatest: false }, '-body -content -html').sort({ lastModified: 'desc' }).limit(versionLimit)
}

DocumentVersion.statics.findRecentVersions = async function (docId, versionLimit = 200) {
  return await this.find({ documentId: docId }, 'html lastModified versionId versionName userId etag')
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
