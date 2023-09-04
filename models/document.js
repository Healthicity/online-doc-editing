'use strict'
const { Schema, model, Types } = require('mongoose')

const Document = new Schema({
  _id: { type: Types.ObjectId, auto: true },
  bucket: String,
  filename: String,
  path: { type: String, unique: true },
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

module.exports = model('documents', Document)
