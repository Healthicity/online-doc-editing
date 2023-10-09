'use strict'
const handleError = require('../middlewares/handleError')
const DocumentModel = require('../models/document')
const DocumentDraftModel = require('../models/document_draft')
const DocumentVersionModel = require('../models/document_version')
const mammoth = require('mammoth')
const s3 = require('../util/s3')
const HTMLtoDOCX = require('html-to-docx')
const OnlineDocument = require('../util/onlineDocument')
const onlineDoc = new OnlineDocument()

class Document {
  static limit = 30
  static versionLimit = 5
  static editingStates = ['Waiting', 'In-progress']
  static reviewStates = ['Review']
  static historyLimit = 200

  static async uploadVersion (req, res, next) {
    try {
      const { draftId } = req.params
      const { userId } = req.query
      const draftDocument = await DocumentDraftModel.findById(draftId, 'content_type html documentId path uploaded_document_revision_id')

      const docxFile = await HTMLtoDOCX(draftDocument.html)
      const data = await s3
        .putObject({
          Bucket: process.env.S3_BUCKET,
          Key: draftDocument.path,
          Body: docxFile,
          ContentType: draftDocument.content_type
        })
        .promise()

      // If data do not have a location prop return an error
      if (data === null || !Object.keys(data).length) {
        throw new Error('No data version')
      }

      var [newDocumentVersion] = await DocumentVersionModel.findRecentVersions(draftDocument.documentId, 1)
      const isSameData = newDocumentVersion.html === draftDocument.html
      
      if (!isSameData) {
        newDocumentVersion = new DocumentVersionModel({
          lastModified: new Date(),
          html: draftDocument.html,
          documentId: draftDocument.documentId,
          userId,
          uploaded_document_revision_id: draftDocument.uploaded_document_revision_id
        })
        await newDocumentVersion.save()
      }
      onlineDoc.updateDoc(newDocumentVersion)

      return res.status(201).send({ status: 'success' })
    } catch (err) {
      console.log(err)
      return res.status(500).send({ status: 'failed', error: err })
    }
  }

  static async generateTransformedEditorContent (req, res, next) {
    try {
      const { documentId } = req.params
      const { uploadedDocumentRevisionId } = req.query
      console.log(req.query)
      const document = await DocumentModel.findById(documentId, 'bucket path filename content_type')

      const data = await s3.getObject({ Bucket: document.bucket, Key: document.path }).promise()

      // Convert to HTML the DOCX file buffer
      const html = await mammoth.convertToHtml({ buffer: data.Body })

      const newDocumentDraft = new DocumentDraftModel({
        bucket: document.bucket,
        filename: document.filename,
        path: document.path,
        content_type: document.content_type,
        html: html.value,
        users: [],
        documentId: document._id,
        uploaded_document_revision_id: uploadedDocumentRevisionId
      })

      await newDocumentDraft.save()

      return res.status(201).send({ status: 'success' })
    } catch (err) {
      console.log(err)
      return res.status(500).send({ status: 'failed', error: err })
    }
  }

  static async getSidebarVersionHistory (req, res, next) {
    const { documentId } = req.params
    try {
      const versions = await DocumentVersionModel.findRecentVersions(documentId, Document.historyLimit)
      const versionObjs = await Promise.all(
        versions.map(async (version) => {
          const versionObj = version.toObject()
          const user = await version.populateUser()
          versionObj.user = user[0]
          return versionObj
        })
      )

      if (!versionObjs.length) return next(handleError(404, 'Documents were not found!'))

      return res.status(200).send({
        totalCount: versionObjs.length,
        versions: versionObjs
      })
    } catch (error) {
      // Destructure error object
      const { statusCode, message, name } = error
      // Return an error
      return next(handleError(statusCode, `An error occurred getting the versions of doc id: ${documentId}`, message, name))
    }
  }

  static async getVersionById (req, res, next) {
    const { versionId } = req.params

    try {
      const version = await DocumentVersionModel.findById(versionId, '-html')
      const versionObj = version.toObject()
      const user = await version.populateUser()
      versionObj.user = user[0]

      return res.status(200).send(versionObj)
    } catch (error) {
      // Destructure error object
      const { statusCode, message, name } = error
      // Return an error
      return next(handleError(statusCode, `An error occurred retrieving the version: ${versionId}`, message, name))
    }
  }
}

module.exports = Document
