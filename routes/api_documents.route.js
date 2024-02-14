const express = require('express')
const documentsRouter = express.Router()
const documentsCtrl = require('../controllers/api_documents.controller')

documentsRouter.get('/recent-versions/:documentId', documentsCtrl.getSidebarVersionHistory) // Get recent versions to sidebar history
documentsRouter.get('/one-version/:versionId', documentsCtrl.getVersionById)

documentsRouter.get('/generate-content/:draftId', documentsCtrl.generateTransformedEditorContent)
documentsRouter.get('/upload-version/:draftId', documentsCtrl.uploadVersion)
documentsRouter.get('/ckeditor/docx-converter/token', documentsCtrl.getCKEditorToken)
module.exports = documentsRouter
