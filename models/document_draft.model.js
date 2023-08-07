'use strict'
const { Schema, model, Types } = require('mongoose')
const StateSchema = require('./state.model')
const UserSchema = require('./user.model')
const DocumentSchema = require('./document.model')

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
  users: [{ type: Schema.Types.ObjectId, ref: UserSchema, default: [] }],
  documentId: { type: Types.ObjectId, ref: DocumentSchema },
  userConfirmations: { type: Number, default: 0 },
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

module.exports = model('document_drafts', DocumentDraft)
