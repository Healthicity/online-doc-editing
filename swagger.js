'use strict'
/**
 * Main configuration file of swagger API documentation
 * To add new schema model, go to -> swagger/schemas/
 * To add new path (endpoint) go to -> swagger/paths
 */

// Import schema models (destructuring)
const {
  S3Document,
  Error400,
  Error401,
  Error403,
  Error404,
  Error422,
  Error500
} = require('./swagger/schemas/index')

// Import paths file
const paths = require('./swagger/paths/paths.json')
// const examples = require('./swagger/examples.json');
const {
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
} = require('./swagger/responses')
const parameters = require('./swagger/parameters.json')
const requestBodies = require('./swagger/requestBodies.json')

// Swagger options configuration
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Document API Project',
      version: '1.0.0',
      description: 'Document API CRUD RESTful documented with Swagger',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html'
      },
      contact: {
        name: 'Globalesm',
        url: 'https://globalesm.com',
        email: 'info@globalesm.com'
      },
      externalDocs: {
        description: 'Find out more',
        url: 'https://globalesm.atlassian.net/wiki/spaces/DCTAPI/overview'
      }
    },
    servers: [
      {
        url: 'http://localhost:3800',
        description: 'Local server'
      }
    ],
    security: [
      {
        ApiKeyAuth: []
      }
    ],
    tags: [
      {
        name: 'S3 Bucket',
        description: 'The S3 bucket API endpoints'
      }
    ],
    components: {
      responses: {
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
      },
      schemas: {
        S3Document,
        Error400,
        Error401,
        Error403,
        Error404,
        Error422,
        Error500
      },
      parameters: parameters,
      requestBodies: requestBodies
    },
    paths: paths
  },
  apis: ['./routes/.js'],
  explorer: true
}

module.exports = options
