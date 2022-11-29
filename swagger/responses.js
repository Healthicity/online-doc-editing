const {
  BadRequest,
  Unauthorized,
  InternalServerError,
  NotFound,
  AlreadyExist,
  UnprocessableEntity
} = require('./responses/generalResponses.json')

const {
  AllObjects200Response,
  AllDeleteMarkers200Response,
  OneObject200Response,
  UploadFile201Response,
  UpdateObject201Response,
  DeleteObject201Response,
  AllObjectVersions200Response,
  RestoreObject200Response
} = require('./responses/s3DocumentResponses.json')

module.exports = {
  BadRequest,
  Unauthorized,
  InternalServerError,
  NotFound,
  AlreadyExist,
  UnprocessableEntity,
  AllObjects200Response,
  AllDeleteMarkers200Response,
  OneObject200Response,
  UploadFile201Response,
  UpdateObject201Response,
  DeleteObject201Response,
  AllObjectVersions200Response,
  RestoreObject200Response
}
