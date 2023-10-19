'use strict'
const { Schema, model, Types } = require('mongoose')

const Document = new Schema({
  _id: { type: Types.ObjectId, auto: true },
  uploaded_document_id: Number,
  created_by_id: Number,
  directory_id: Number,
  subdomain: String,
}, { timestamps: true })

Document.index({
  subdomain: 1, uploaded_document_id: 1
}, {
  unique: true
})

module.exports = model('documents', Document)