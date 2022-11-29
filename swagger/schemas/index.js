const { S3Document } = require('./s3_document.schema.json');
const { Error400, Error401, Error403, Error404, Error422, Error500 } = require('./errors.schema.json')

module.exports = { 
  S3Document, 
  Error400,
  Error401, 
  Error403, 
  Error404, 
  Error422,
  Error500
}
