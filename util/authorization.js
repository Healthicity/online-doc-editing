const jwt = require('jsonwebtoken')

function decryptAccessToken (authorization_header) {
  const accessToken = authorization_header.split(' ')[1]
  return jwt.verify(accessToken, process.env.JWT_SECRET)
}

function authorize(req, draftDocumentId) {
  payload = decryptAccessToken(req.headers.authorization)
  const payloadExpired = payload.expires_in < Date.now() / 1000
  if ( payloadExpired || payload.document_draft_id !== draftDocumentId) {
    throw new Error('Unauthorized')
  }
}


module.exports = {
  decryptAccessToken,
  authorize
}
