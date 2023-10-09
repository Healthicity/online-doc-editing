'use strict'
const { Schema, model, Types } = require('mongoose')

const Document = new Schema({
  _id: { type: Types.ObjectId, auto: true },
  bucket: String,
  uploaded_document_id: Number,
  filename: String,
  content_type: String,
  path: { type: String },
}, { timestamps: true })

Document.index({
  path: 1, uploaded_document_id: 1
}, {
  unique: true
})

module.exports = model('documents', Document)