'use strict'
const handleError = require('../middlewares/handleError')
const DocumentModel = require('../models/document')
const DocumentDraftModel = require('../models/documentdraft')
const StateModel = require('../models/state')
const DocumentVersionModel = require('../models/documentversion')

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
  static async getDocumentsByState (req, res, next) {
    try {
      // Get state ids
      const stateIds = await StateModel.findByState(res.locals.statesToFind)

      // Get only documents that match the state ids
      const data = await DocumentDraftModel
        .find({ stateId: { $in: stateIds } }, 'bucket filename path userConfirmations stateId users createdAt updatedAt')
        .populate('stateId')
        .populate('users')
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
      if (totalCount.length === 0) return next(handleError(404, 'There are no editing documents in the database!'))

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
      const lastUploads = await DocumentModel.find({}, '-content -body').sort({ createdAt: 'desc' }).limit(Document.limit)

      if (!lastUploads.length) {
        return next(handleError(404, 'Documents were not found!'))
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
      const versions = await DocumentVersionModel.findRecentVersions(documentId, Document.historyLimit)
      console.log(versions);
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
      .populate('userId')

      return res.status(200).send(version)

    } catch (error) {
      // Destructure error object
      const { statusCode, message, name } = error
      // Return an error
      return next(handleError(statusCode, `An error occurred retrieving the version: ${versionId}`, message, name))
    }
  }

  

  // static async createDraftDocument (req, res, next) {
  //   const newData = req.body

  //   try {
  //     const newDraft = new DocumentDraftModel(newData)
  //     await newDraft.save()
  //   } catch (error) {
  //     // Destructure error object
  //     const { statusCode, message, name } = error
  //     // Return an error
  //     return next({
  //       status: statusCode,
  //       apiMessage: message,
  //       friendlyMessage: 'An error occurred getting the editing documents',
  //       errorName: name
  //     })
  //   }
  // }
}

module.exports = Document
