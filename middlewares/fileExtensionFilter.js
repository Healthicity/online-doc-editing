/**
 * Restrict file upload to only .docx and .doc extension
 */
const path = require('path')
const handleError = require('./handleError')

module.exports = (req, file, cb) => {
  const ext = path.extname(file.originalname)
  if (ext !== '.docx' && ext !== '.doc') {
    const error = new Error('Only documents with extension .docx or .doc are allowed.', req.originalUrl)
    // eslint-disable-next-line node/no-callback-literal
    return cb(handleError(422, error.message))
  }
  cb(null, true)
}
