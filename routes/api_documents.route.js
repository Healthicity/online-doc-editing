const express = require('express')
const documentsRouter = express.Router()
const documentsCtrl = require('../controllers/api_documents.controller')
const documentStateFilter = require('../middlewares/documents/documentStateFilter')
const Validator = require('../middlewares/validator')

// const Validator = require('../middlewares/validator')

documentsRouter.get('/documents', documentStateFilter, documentsCtrl.getDocumentsByState) // Get all documents

documentsRouter.get('/versions/:documentId', documentsCtrl.getDocumentVersions)
documentsRouter.get('/recent-versions/:documentId', documentsCtrl.getSidebarVersionHistory) // Get recent versions to sidebar history
documentsRouter.get('/total-count', documentsCtrl.countDocumentStates) // Get total count of each document state
documentsRouter.get('/last-uploads', documentsCtrl.lastDocumentUploads) // Get last document uploads
documentsRouter.get('/one-version/:versionId', Validator('getVersionById'), documentsCtrl.getVersionById)

documentsRouter.put('/version-name/:versionId/', Validator('updateVersionName'), documentsCtrl.updateVersionName)
// Not used at this moment
// documentsRouter.get('/count', documentStateFilter, documentsCtrl.countDocuments) // Get total count by document state

// documentsRouter.get('/objects', Validator('getObjects'), documentsCtrl.allObjects) // Get all objects from one bucket
// documentsRouter.get('/objects/versions', Validator('getObjectsVersions'), documentsCtrl.allObjectVersions) // Get all object versions from one bucket
// documentsRouter.get('/objects/versions/one', Validator('getObjectsVersionsId'), documentsCtrl.oneObject) // Get one specific object
// documentsRouter.get('/delete-markers', Validator('getDeleteMarkers'), documentsCtrl.allDeleteMarkers) // Get all delete markers objects
// documentsRouter.post('/', documentsCtrl.createDraftDocument)

module.exports = documentsRouter
