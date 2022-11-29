'use strict'
const { Schema, model, Types } = require('mongoose')

const Document = new Schema({
  _id: { type: Types.ObjectId, auto: true },
  bucket: String,
  filename: { type: String, unique: true },
  path: String,
  content: Buffer,
  body: Object,
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

module.exports = model('documents', Document)
