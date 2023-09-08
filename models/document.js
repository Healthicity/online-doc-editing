'use strict'
const { Schema, model, Types } = require('mongoose')

const Document = new Schema({
  _id: { type: Types.ObjectId, auto: true },
  bucket: String,
  uploaded_document_revision_id: Number,
  filename: String,
  path: { type: String },
  content: Buffer,
  body: Object,
  html: String,
  extension: String,
  lastModified: Date,
  contentLength: Number,
  etag: String,
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

Document.index({
  path: 1, uploaded_document_revision_id: 1
}, { 
  unique: true 
})

module.exports = model('documents', Document)
