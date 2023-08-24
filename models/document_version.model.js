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
  html: String,
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
  return await this.find({ documentId: docId, isLatest: false }, '-body -content -html').sort({ lastModified: 'desc' }).limit(versionLimit)
}

// DocumentVersion.statics.findRecentVersions2 = async function (docId, versionLimit = 200) {
//   return await this.find({ documentId: docId }, 'lastModified versionId versionName userId')
//     .sort({ lastModified: 'desc' })
//     .limit(versionLimit)
//     .populate('userId')
// }

DocumentVersion.statics.findRecentVersions = async function (docId, versionLimit = 200) {
  return await this.aggregate([
    { $match: { documentId: new Types.ObjectId(docId) } },
    { $lookup: { from: 'users', localField: 'userId', foreignField: 'id', as: 'user' } }
  ])
    .allowDiskUse(true)
    .project('lastModified versionId versionName userId')
    .limit(versionLimit)
    .sort({ lastModified: 'desc' })
}

module.exports = model('document_versions', DocumentVersion)
