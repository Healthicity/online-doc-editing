'use strict'
const handleError = require('../middlewares/handleError')
const DocumentDraftModel = require('../models/document_draft')
const DocumentVersionModel = require('../models/document_version')
const mammoth = require('mammoth')
const s3 = require('../util/s3')
const HTMLtoDOCX = require('html-to-docx')
const OnlineDocument = require('../util/onlineDocument')
const onlineDoc = new OnlineDocument()
const { authorize } = require('../util/authorization')

class Document {
  static historyLimit = 200

  static async uploadVersion (req, res, next) {
    try {
      const { draftId } = req.params
      const { userId } = req.query
      const draftDocument = await DocumentDraftModel.findById(draftId, 'content_type html documentId path')

      authorize(req, draftDocument._id.toString())

      const headerString = "<div><span='border:1px solid red'> <img src='data:image/jpeg;base64,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' /> </span> Iam Header</div>"

      const footerHTMLString = "<div style='font-size: 7px; display: flex; justify-content: space-between;'><span style='text-align: left; flex: 1;display: inline-block;color:blue;'>Iam Footer</span><span style='width: 200px;margin-right: 30px;'></span></div>&nbsp;&nbsp;";

      const docxFile = await HTMLtoDOCX(draftDocument.html , headerString, {
        table: { row: { cantSplit: true } },
        font: 'Helvetica',
        fontSize: 28,
        header: true,
        pageNumber: true,
        footer: true,
      }, footerHTMLString);

      const data = await s3
        .putObject({
          Bucket: process.env.S3_BUCKET,
          Key: draftDocument.path,
          Body: docxFile,
          ContentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        })
        .promise()

      // If data do not have a location prop return an error
      if (data === null || !Object.keys(data).length) {
        throw new Error('No data version')
      }

      var [newDocumentVersion] = await DocumentVersionModel.findRecentVersions(draftDocument.documentId, 1)
      // newDocumentVersion can be empty if CM user does not open the editor but still select "Edit document" option
      const isSameData = newDocumentVersion?.html === draftDocument.html
      
      if (!isSameData) {
        newDocumentVersion = new DocumentVersionModel({
          lastModified: new Date(),
          html: draftDocument.html,
          documentId: draftDocument.documentId,
          userId,
          draftDocumentId: draftDocument._id
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
      const { draftId } = req.params
      const draftDocument = await DocumentDraftModel.findById(draftId)
      authorize(req, draftDocument._id.toString()) // Check if the user is authorized to access the document
      const data = await s3.getObject({ Bucket: draftDocument.bucket, Key: draftDocument.path }).promise()

      // Convert to HTML the DOCX file buffer
      const html = await mammoth.convertToHtml({ buffer: data.Body })

      await DocumentDraftModel.findByIdAndUpdate(draftId, {
        $set: {
          html: html.value,
        }
      })

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
