const express = require('express')
const envelopeRouter = express.Router()
const envelopeCtrl = require('../controllers/api_envelopes.controller')

envelopeRouter.get('/accounts/:accountId/envelopes/:envelopeId', envelopeCtrl.allEnvelopes)
envelopeRouter.post('/accounts/:accountId/envelopes', envelopeCtrl.newEnvelope)
module.exports = envelopeCtrl
