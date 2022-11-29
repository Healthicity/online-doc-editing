/**
 * Import all validators schemas
 * the variables are the validators name middleware
 * It is named by the following: using camel case
 * {method}{path name}: getObjects: get('/objects/)
 */

const getObjects = require('./allObjects.validation')
const getObjectsVersions = require('./allObjectsVersions.validation')
const getObjectsVersionsId = require('./oneObjectVersion.validation')
const getDeleteMarkers = require('./deleteMarkers.validation')
const postObject = require('./uploadObject.validation')
const putUpdate = require('./updateObject.validation')
const deleteObject = require('./deleteObject.validation')
const restoreObject = require('./restoreObject.validation')
const updateVersionName = require('./updateVersionName.validation')
const getVersionById = require('./getVersionById.validation')

module.exports = {
  getObjects,
  getObjectsVersions,
  getObjectsVersionsId,
  getDeleteMarkers,
  postObject,
  putUpdate,
  deleteObject,
  restoreObject,
  updateVersionName,
  getVersionById
}
