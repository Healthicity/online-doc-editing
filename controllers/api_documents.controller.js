'use strict'
const handleError = require('../middlewares/handleError')
const DocumentModel = require('../models/document')
const DocumentDraftModel = require('../models/document_draft')
const StateModel = require('../models/state')
const DocumentVersionModel = require('../models/document_version')
const mammoth = require('mammoth')
const s3 = require('../util/s3')
const { getDeltaFromHtml } = require('../middlewares/quillConversion')

class Document {
  static limit = 30
  static versionLimit = 5
  static editingStates = ['Waiting', 'In-progress']
  static reviewStates = ['Review']
  static historyLimit = 200

  // constructor(){}
  /**
   * Return a list of all documents that only includes state:
   * Waiting, In-progress (editing mode)
   */

  static async generateTransformedEditorContent (req, res, next) {
    try {
      const { documentId } = req.params;
      console.log(documentId)
      const document = await DocumentModel.findById(documentId, 'filename bucket path etag extension');

      console.log("*********");
      console.log(document);

      const path = document.path;
      const data = await s3.getObject({ Bucket: document.bucket, Key: document.path }).promise()


      // Convert to HTML the DOCX file buffer
      const html = await mammoth.convertToHtml({ buffer: data.Body })

      // Convert to Quill Delta object from the HTML data
      const delta = await getDeltaFromHtml(html.value)
      const waitingStateId = await StateModel.findByState(['Waiting'])

      await DocumentModel.updateOne({ _id: documentId }, { 
        content: data.Body,
        body: delta,
        html: html.value,
        lastModified: data.LastModified,
        contentLength: data.ContentLength
      });
      
      const newDocumentDraft = new DocumentDraftModel({
        bucket: document.bucket,
        filename: document.filename,
        content: data.Body,
        path: document.path,
        extension: document.extension,
        body: delta,
        html: html.value,
        etag: document.etag,
        stateId: waitingStateId,
        users: [],
        documentId: document._id
      })
  
      await newDocumentDraft.save()

      return res.status(201).send({ status: 'success' })
    } catch (err) {
      console.log(err)
      return res.status(500).send({ status: 'failed', error: err })
    }
  }

  static async getDocumentsByState (req, res, next) {
    try {
      // Get state ids
      const stateIds = await StateModel.findByState(res.locals.statesToFind)

      // Get only documents that match the state ids
      const data = await DocumentDraftModel
        .find({ stateId: { $in: stateIds } }, 'bucket filename path userConfirmations stateId users createdAt updatedAt')
        .populate('stateId')
      // console.log(data);

      // In case data has length 0
      if (!data.length) {
        return next(handleError(404, 'Documents were not found!'))
      }

      // Return an object of each document with their respective versions
      const updateData = data.map(async (doc, index) => {
        try {
          const versions = await DocumentVersionModel.findByDocId(doc.id, Document.versionLimit)
          return { ...doc._doc, versions }
        } catch (error) {
          return new Error('An error occured executing the getVersionsByDocument function!')
        }
      })
      
      // Resolve update data
      const dataValues = await Promise.all(updateData)

      // Return total count and documents
      return res.status(200).send({
        totalCount: data.length,
        documents: dataValues
      })
    } catch (error) {
      // Destructure error object
      const { statusCode, message, name } = error
      // Return an error
      return next(handleError(statusCode, 'An error occurred getting the editing documents', message, name))
    }
  }

  static async getDocumentVersions(req, res, next) {
    const {documentId} = req.params
    try {
      const versions = await DocumentVersionModel.find({documentId: documentId}, '-body -content')

      if (!versions.length) return next(handleError(404, 'Documents were not found!'))

      return res.status(200).send({
        totalCount: versions.length,
        versions: versions
      })
    } catch (error) {
      // Destructure error object
      const { statusCode, message, name } = error
      // Return an error
      return next(handleError(statusCode, `An error occurred getting the versions of doc id: ${documentId}`, message, name))
    }
  }

  static async countDocumentStates (req, res, next) {
    try {
      const aggregatorOpts = [
        { $lookup: {from: 'states', localField: 'stateId', foreignField: '_id', as: 'state'} },
        { $unwind: '$state' },
        {
          $group: {
            _id: "$state._id",
            state : { $first: '$state.state' },
            description : { $first: '$state.description' },
            totalCount: { $sum: 1 }
          }
        },
      ]

      // const totalCount = await DocumentDraftModel.countDocuments({ stateId: { $in: stateIds }})
      const totalCount = await DocumentDraftModel.aggregate(aggregatorOpts).exec()
      // const result = await DocumentDraftModel.populate(totalCount, {path: '_id'})
      // console.log(totalCount);
      // if (totalCount.length === 0) return next(handleError(404, 'There are no editing documents in the database!'))
      if (totalCount.length === 0) {
        return res.status(200).send([])
      }

      return res.status(200).send(totalCount)
    } catch (error) {
      // Destructure error object
      const { statusCode, message, name } = error
      // Return an error
      return next(handleError(statusCode, 'An error occurred getting the total count editing documents', message, name))
    }
  }

  static async countDocuments (req, res, next) {
    try {
      const stateIds = await StateModel.findByState(res.locals.statesToFind)
      console.log(stateIds)

      const totalCount = await DocumentDraftModel.countDocuments({ stateId: { $in: stateIds }})

      if (totalCount === 0) return next(handleError(404, 'There are no editing documents in the database!'))

      return res.status(200).json({totalCount})
    } catch (error) {
      // Destructure error object
      const { statusCode, message, name } = error
      // Return an error
      return next(handleError(statusCode, 'An error occurred getting the total count editing documents', message, name))
    }
  }

  static async lastDocumentUploads(req, res, next) {
    try {
      const lastUploads = await DocumentDraftModel.find({}, '-content -body -html').sort({ createdAt: 'desc' }).limit(Document.limit)

      if (!lastUploads.length) {
        // return next(handleError(404, 'Documents were not found!'))
        return res.status(200).send({ totalCount: 0, documents: [] })
      }

      return res.status(200).send({
        totalCount: lastUploads.length,
        documents: lastUploads
      })
    } catch (error) {
      // Destructure error object
      const { statusCode, message, name } = error
      // Return an error
      return next(handleError(statusCode, 'An error occurred getting the last upload documents', message, name))
    }
  }

  static async getSidebarVersionHistory(req, res, next) {
    const {documentId} = req.params
    try {
      var versions = await DocumentVersionModel.findRecentVersions(documentId, Document.historyLimit)
      const versionObjs = await Promise.all(
        versions.map(async (version) => {
          var versionObj = version.toObject();
          const user = await version.populateUser();
          versionObj.user = user[0];
          return versionObj;
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

  static async updateVersionName(req, res, next) {
    const { versionId } = req.params
    const { versionName } = req.body
    try {
      await DocumentVersionModel.findOneAndUpdate({ versionId: versionId }, { versionName: versionName })

      return res.status(201).send({ message: `Version: ${versionId} successfully updated!`})
    } catch (error) {
      // Destructure error object
      const { statusCode, message, name } = error
      // Return an error
      return next(handleError(statusCode, `An error occurred updating the version: ${versionId}`, message, name))
    }
  }

  static async getVersionById(req, res, next) {
    const { versionId } = req.params

    try {
      const version = await DocumentVersionModel.findById(versionId, '-content -isLatest -etag')
      var versionObj = version.toObject();
      const user = await version.populateUser();
      versionObj.user = user[0];

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
