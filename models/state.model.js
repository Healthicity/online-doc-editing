'use strict'
const { Schema, model, Types } = require('mongoose')

const State = new Schema({
  _id: { type: Types.ObjectId, auto: true },
  state: String,
  code: Number,
  description: String,
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

State.statics.findByState = async function (states) {
  states = states.map(st => new RegExp(st, 'i'))
  const data = await this.find({ state: { $in: states } }, '_id')
  return data.map(doc => doc.id)
}

module.exports = model('State', State)
