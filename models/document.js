'use strict'
const { Schema, model, Types } = require('mongoose')

const Document = new Schema({
  _id: { type: Types.ObjectId, auto: true },
  bucket: String,
<<<<<<< HEAD:models/document.model.js
  filename: { type: String, unique: true },
  path: String,
=======
  uploaded_document_revision_id: Number,
  filename: String,
  path: { type: String },
>>>>>>> 89d9b0bfaa646199bc85ffef9d870b8ca801707d:models/document.js
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
