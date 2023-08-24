'use strict'
const mammoth = require('mammoth')
const { getDeltaFromHtml } = require('../quillConversion')
const through2 = require('through2')
const DocumentModel = require('../../models/document.model')
const DocumentDraftModel = require('../../models/document_draft.model')
const StateModel = require('../../models/state.model')

let s3File = {}

const convertToHtml = (filename, extension, cb = () => null) => through2({ objectMode: true }, async function (chunk, enc, done) {
  try {
    const html = await mammoth.convertToHtml({ buffer: chunk })
    const delta = await getDeltaFromHtml(html.value)
    // console.log(delta)
    const etag = s3File.ETag.substring(1, s3File.ETag.length - 1)

    // SAVE DOCUMENT TO DATABASE
    const newDocument = new DocumentModel({
      bucket: process.env.S3_BUCKET,
      filename: filename,
      content: chunk,
      path: s3File.Key,
      extension: extension,
      body: delta,
      etag
    })

    // Saved document
    const documentSaved = await newDocument.save()

    // Get state ids
    let waitingStateId = await StateModel.findByState(['Waiting'])

    if (!waitingStateId.length) {
      const newState = new StateModel({
        state: 'waiting',
        description: 'A description of this state',
        code: '01'
      });

      await newState.save();

      waitingStateId.push(newState.id)
    }

    const newDocumentDraft = new DocumentDraftModel({
      bucket: process.env.S3_BUCKET,
      filename: filename,
      content: chunk,
      path: s3File.Key,
      extension: extension,
      body: delta,
      etag: s3File.ETag.substring(1, s3File.ETag.length - 1),
      stateId: waitingStateId,
      users: [],
      documentId: documentSaved._id
    })

    await newDocumentDraft.save()

    // Remove local upload file from disk
    cb()

    done(null, JSON.stringify({ data: s3File.Location, message: `File ${filename} was successfully uploaded!` }))
  } catch (error) {
    done(error)
  }
}).on('error', (err) => {
  throw new Error(err.message)
})

const uploadToS3 = (s3, bucketName, filename) => through2({ objectMode: true }, async function (chunk, enc, done) {
  try {
    // Upload new file to bucket
    const data = await s3
      .upload({
        Bucket: bucketName,
        Key: filename,
        Body: chunk
      })
      .promise()

    // If data do not have a location prop return an error
    if (!data.Location) {
      throw new Error('No data location')
    }
    s3File = data

    this.push(chunk)

    // New file upload successfully
    done()
  } catch (error) {
    done(error)
  }

  // return res.status(201).send({ data: data.Location, message: `File ${newFilename} was successfully uploaded!` })
}).on('error', (err) => {
  throw new Error(err.message)
})

const bufferToDelta = async (originalname, extension, buffer, s3Object) => {
  const etag = s3Object.ETag.substring(1, s3Object.ETag.length - 1)

  try {
    const html = await mammoth.convertToHtml({ buffer })
    const delta = await getDeltaFromHtml(html.value)

    const document = new DocumentModel({
      bucket: process.env.S3_BUCKET,
      filename: originalname,
      content: buffer,
      path: s3Object.Key,
      extension: extension,
      body: delta,
      html: html.value,
      etag
    })

    await document.save()

    const waitingStateId = await StateModel.findByState(['Waiting'])

    if (!waitingStateId.length) {
      const state = new StateModel({
        state: 'waiting',
        description: 'A description of this state',
        code: '01'
      })

      await state.save()

      waitingStateId.push(state.id)
    }

    const documentDraft = new DocumentDraftModel({
      bucket: process.env.S3_BUCKET,
      filename: originalname,
      content: buffer,
      path: s3Object.Key,
      extension: extension,
      body: delta,
      html: html.value,
      etag: etag,
      stateId: waitingStateId,
      users: [],
      documentId: document._id
    })

    await documentDraft.save()
  } catch (err) {
    console.error('Error creating models when uploading file')

    throw err
  }
}

module.exports = { convertToHtml, uploadToS3, bufferToDelta }
