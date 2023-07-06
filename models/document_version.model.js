'use strict'
const { Schema, model, Types } = require('mongoose')
const DocumentSchema = require('./document.model')
const UserSchema = require('./user.model')

const DocumentVersion = new Schema({
  _id: { type: Types.ObjectId, auto: true },
  etag: String,
  isLatest: { type: Boolean, default: false },
  lastModified: Date,
  versionId: { type: String, unique: true },
  body: Object,
  content: Buffer,
  versionName: { type: String, default: '' },
  userId: { type: Types.ObjectId, ref: UserSchema },
  documentId: { type: Types.ObjectId, ref: DocumentSchema },
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

DocumentVersion.statics.findByDocId = async function (docId, versionLimit) {
  return await this.find({ documentId: docId, isLatest: false }, '-body -content').sort({ lastModified: 'desc' }).limit(versionLimit)
}

DocumentVersion.statics.findRecentVersions = async function (docId, versionLimit = 200) {
  return await this.find({ documentId: docId }, 'body lastModified versionId versionName userId')
    .sort({ lastModified: 'desc' })
    .limit(versionLimit)
    .populate('userId')
}

module.exports = model('document_versions', DocumentVersion)
