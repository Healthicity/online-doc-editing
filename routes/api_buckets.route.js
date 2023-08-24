const express = require('express')
const multer = require('multer')
const bucketsRouter = express.Router()
const bucketsCtrl = require('../controllers/api_buckets.controller')
const Validator = require('../middlewares/validator')
const mimeTypes = require('mime-types')
const fileExtensionFilter = require('../middlewares/fileExtensionFilter')

// Local storage when upload file
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname.split('.').slice(0, -1).join('.') + '.' + mimeTypes.extension(file.mimetype))
  }
})

// Upload file multer options
const upload = multer({
  storage: storage,
  fileFilter: fileExtensionFilter
})

bucketsRouter.get('/', bucketsCtrl.allBuckets) // Get all buckets
bucketsRouter.get('/objects', Validator('getObjects'), bucketsCtrl.allObjects) // Get all objects from one bucket
bucketsRouter.get('/objects/versions', Validator('getObjectsVersions'), bucketsCtrl.allObjectVersions) // Get all object versions from one bucket
bucketsRouter.get('/objects/versions/one', Validator('getObjectsVersionsId'), bucketsCtrl.oneObject) // Get one specific object
bucketsRouter.get('/delete-markers', Validator('getDeleteMarkers'), bucketsCtrl.allDeleteMarkers) // Get all delete markers objects

bucketsRouter.post('/object', upload.single('filename'), Validator('postObject'), bucketsCtrl.upFile) // Upload a file to a bucket
// bucketsRouter.put('/update', Validator('putUpdate'), bucketsCtrl.updateObject)
bucketsRouter.delete('/object', Validator('deleteObject'), bucketsCtrl.deleteObject) // Delete object version
bucketsRouter.delete('/object/restore', Validator('restoreObject'), bucketsCtrl.restoreObject) // Restore object

module.exports = bucketsRouter
