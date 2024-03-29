'use strict'
const handleError = require('../middlewares/handleError')
const DocumentDraftModel = require('../models/document_draft')
const DocumentVersionModel = require('../models/document_version')
const { s3, readFile } = require('../util/s3')
const HTMLtoDOCX = require('html-to-docx')
const OnlineDocument = require('../util/onlineDocument')
const onlineDoc = new OnlineDocument()
const { authorize, ckeDocxToHtml, ckEditorTokenGenerator } = require('../util/common')

class Document {
  static historyLimit = 200

  static async uploadVersion (req, res, next) {
    try {
      const { draftId } = req.params
      const { userId } = req.query
      const draftDocument = await DocumentDraftModel.findById(draftId, 'content_type html header footer documentId path')

      authorize(req, draftDocument._id.toString())

      const docxFile = await HTMLtoDOCX(draftDocument.html , draftDocument.header, {
        table: { row: { cantSplit: true } },
        header: true,
        pageNumber: true,
        footer: true,
      }, draftDocument.footer);

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
      const isSameContentData =  draftDocument.content && newDocumentVersion?.html === draftDocument.html;
      const isSameHeaderData =  draftDocument.header && newDocumentVersion?.header === draftDocument.header;
      const isSameFooterData =  draftDocument.footer && newDocumentVersion?.footer === draftDocument.footer;

      if (!isSameContentData || !isSameHeaderData || !isSameFooterData) {
        newDocumentVersion = new DocumentVersionModel({
          lastModified: new Date(),
          html: draftDocument.html,
          header: draftDocument.header,
          footer: draftDocument.footer,
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

  static async getCKEditorToken (req, res, next) {
    try {
      return res.status(200).send(ckEditorTokenGenerator())
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

      const data =  await readFile(draftDocument);
      const htmlData = await ckeDocxToHtml(data);

      // Convert to HTML the DOCX file buffer
      // const html = await mammoth.convertToHtml({ buffer: data.Body })

      await DocumentDraftModel.findByIdAndUpdate(draftId, {
        $set: {
          html: htmlData,
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
