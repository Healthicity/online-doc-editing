'use strict'
const DocumentModel = require('../models/document')
const FileType = require('file-type')
const s3 = require('../util/s3')
const mammoth = require('mammoth')
const { getDeltaFromHtml, getHtmlFromDelta } = require('../middlewares/quillConversion')
const HTMLtoDOCX = require('html-to-docx')
const fs = require('fs')
const fsPromises = require('fs/promises')
const path = require('path')

module.exports = (io, socket) => {
  const findOrCreateLatestS3Document = async (
    tag,
    bucket = null,
    key = null
  ) => {
    if (tag == null) return

    try {
      // Find the document by s3 tag in mongo database
      const document = await DocumentModel.findOne({
        path: key,
        etag: tag
      })

      // In case document exists in mongo database, retrieve it
      if (document) {
        return document
      }

      // In case document does not exist, create it in mongo database
      // Get file from S3 Bucket
      const data = await s3.getObject({ Bucket: bucket, Key: key }).promise()

      // In case object was not found
      if (!Object.keys(data).length) {
        return new Error(`Object for bucket ${bucket} and key ${key} was not found!`)
      }

      // Get filename from key argument
      let filename = key.split('/')
      filename = filename[filename.length - 1]

      // Get extension and content-type
      const fileType = await FileType.fromBuffer(data.Body)

      // Get file versions
      const { Versions } = await s3.listObjectVersions({ Bucket: bucket, Prefix: key }).promise()

      // Save buffer inside a file locally in server temporary
      fs.writeFileSync(path.join(__dirname, `../out/${filename}`), data.Body, 'binary')
      const fileData = fs.readFileSync(path.join(__dirname, `../out/${filename}`), 'binary')

      // Convert to HTML the DOCX file buffer
      const html = await mammoth.convertToHtml({ buffer: fileData })

      // Convert to Quill Delta object from the HTML data
      const delta = await getDeltaFromHtml(html.value)

      // Map through document versions to return a custom object version array
      const filterVersions = Versions.map(version => {
        return { etag: version.ETag, isLatest: version.IsLatest, lastModified: version.LastModified, versionId: version.VersionId, body: null, content: null }
        // return { etag: version.ETag, isLatest: version.IsLatest, lastModified: version.LastModified, versionId: version.VersionId, body: delta }
      })

      // Create document in mongo database with his props and quill delta object
      const documentCreated = await DocumentModel.create({
        bucket: bucket,
        filename: `${filename}`,
        path: key,
        content: data.Body, // Buffer data
        body: delta,
        versions: [...filterVersions],
        extension: fileType.ext,
        lastModified: data.LastModified,
        contentLength: data.ContentLength,
        etag: data.ETag.replace(/['"]+/g, '')
      })

      // Remove local file from disk
      await fsPromises.unlink(path.join(__dirname, `../out/${filename}`))

      // Return successfully document created
      return documentCreated
    } catch (error) {
      console.log('An error occured in findOrCreateLatests3Document method')
      console.log(error.message)
      return error
    }
  }

  const findOrCreateS3DocumentVersion = async (
    tag,
    bucket = null,
    key = null,
    versionId = null
  ) => {
    try {
      // Find the document by s3 tag and versionId in mongo database
      const document = await DocumentModel.findOne({
        path: key,
        etag: tag
      })
      // In case document exists in mongo database, retrieve it
      if (document) {
        const docVersion = document.versions.find(version => version.versionId === versionId)
        // In case body is null
        if (!docVersion.body) {
          // Get file from S3 Bucket by specific version
          const docVersionData = await s3.getObject({ Bucket: bucket, Key: key, VersionId: versionId }).promise()

          if (!Object.keys(docVersionData).length) {
            return new Error(`Error: Document ${key} with versionId: ${versionId} was not found`)
            // return socket.emit('error', new Error(`Error: Document ${key} was not found`))
          }

          // Get filename from key argument
          let filename = key.split('/')
          filename = filename[filename.length - 1]

          // Get extension and content-type
          // let fileType = filename.split('.')
          // fileType = fileType[fileType.length - 1]
          // console.log(fileType)

          // Save buffer inside a file locally in server temporary
          fs.writeFileSync(path.join(__dirname, `../out/${filename}`), docVersionData.Body, 'binary')
          const fileData = fs.readFileSync(path.join(__dirname, `../out/${filename}`), 'binary')

          // Convert to HTML the DOCX file buffer
          const htmlDocVersionData = await mammoth.convertToHtml({ buffer: fileData })

          // Convert to Quill Delta object from the HTML data
          const deltaVersion = await getDeltaFromHtml(htmlDocVersionData.value)

          // Find current version document and update it with delta and buffer data
          let currentDocVersion = await DocumentModel.findOneAndUpdate({ etag: tag, path: key, 'versions.versionId': versionId }, {
            $set: {
              'versions.$.body': deltaVersion,
              'versions.$.content': docVersionData.Body
            }
          })

          // Remove local file from disk
          await fsPromises.unlink(path.join(__dirname, `../out/${filename}`))

          // Find currently created versioned file in Mongo DB and return it
          currentDocVersion = await DocumentModel.findOne({ etag: tag, filename: key, 'versions.versionId': versionId })
          return currentDocVersion
        }
        return docVersion
      }

      // In case document does not exist, create it in mongo database
      // Get file from S3 Bucket by bucket and key name
      const latestDocumentData = await s3.getObject({ Bucket: bucket, Key: key }).promise()

      // Get file from S3 Bucket by specific version
      const dataVersion = await s3.getObject({ Bucket: bucket, Key: key, VersionId: versionId }).promise()

      // In case the main document or document version doesn't exist
      if (!Object.keys(latestDocumentData).length || !Object.keys(dataVersion).length) {
        return new Error(`Error: Document ${key} or version ${versionId} was not found`)
      }

      // Get file versions
      const { Versions } = await s3.listObjectVersions({ Bucket: bucket, Prefix: key }).promise()

      // Get filename from key argument
      let filename = key.split('/')
      filename = filename[filename.length - 1].split('.')[0]

      // Get extension and content-type from dataVersion
      const docType = await FileType.fromBuffer(latestDocumentData.Body)

      // Save version buffer inside a file locally in server temporary
      fs.writeFileSync(path.join(__dirname, `../out/${filename}-${versionId}.${docType.ext}`), dataVersion.Body, 'binary')
      const versionFile = fs.readFileSync(path.join(__dirname, `../out/${filename}-${versionId}.${docType.ext}`), 'binary')

      // Convert to HTML the DOCX file buffer
      const htmlVersionData = await mammoth.convertToHtml({ buffer: versionFile })

      // Convert to Quill Delta object from the HTML data
      const deltaVersion = await getDeltaFromHtml(htmlVersionData.value)

      // Save version buffer inside a file locally in server temporary
      fs.writeFileSync(path.join(__dirname, `../out/${filename}.${docType.ext}`), latestDocumentData.Body, 'binary')
      const latestDocumentFile = fs.readFileSync(path.join(__dirname, `../out/${filename}.${docType.ext}`), 'binary')

      // Convert to HTML the DOCX file buffer
      const htmlLatestDocumentData = await mammoth.convertToHtml({ buffer: latestDocumentFile })

      // Convert to Quill Delta object from the HTML data
      const deltaLatestDocument = await getDeltaFromHtml(htmlLatestDocumentData.value)

      const filterVersions = Versions.map(version => {
        return version.VersionId === versionId
          ? { etag: version.ETag, isLatest: version.IsLatest, lastModified: version.LastModified, versionId: version.VersionId, body: deltaVersion, content: dataVersion.Body }
          : { etag: version.ETag, isLatest: version.IsLatest, lastModified: version.LastModified, versionId: version.VersionId, body: null, content: null }
      })

      // Create document in mongo database with his props and quill delta object
      const documentCreated = await DocumentModel.create({
        bucket: bucket,
        filename: `${filename}.${docType.ext}`,
        path: key,
        content: latestDocumentData.Body, // Buffer data
        body: deltaLatestDocument,
        versions: [...filterVersions],
        extension: docType.ext,
        lastModified: latestDocumentData.LastModified,
        contentLength: latestDocumentData.ContentLength,
        etag: latestDocumentData.ETag.replace(/['"]+/g, '')
      })

      // Remove local file from disk
      const unlinkVersion = fsPromises.unlink(path.join(__dirname, `../out/${filename}-${versionId}.${docType.ext}`))
      const unlinkLatestDocument = fsPromises.unlink(path.join(__dirname, `../out/${filename}.${docType.ext}`))

      await Promise.all([unlinkVersion, unlinkLatestDocument])

      // Return successfully the document version
      return documentCreated.versions.find(version => {
        return version.versionId === versionId
      })
    } catch (error) {
      throw new Error('Kaboom!')
    }
  }

  // Get document function
  const getS3Document = async (
    tag,
    bucket = null,
    key = null,
    versionId = null
  ) => {
    try {
      let s3Doc

      // Get document or create new one if doesn't exist
      if (versionId) {
        s3Doc = await findOrCreateS3DocumentVersion(tag, bucket, key, versionId)
      } else {
        // Get latest document (able to edit) or create new one if doesn't exist
        s3Doc = await findOrCreateLatestS3Document(tag, bucket, key)
      }
      // Make all socket instances join the same room document
      // with the specific tag
      socket.join(tag)

      // Load document into client
      socket.emit('load-document', s3Doc.body)

      // Send updated changes
      socket.on('send-changes', (delta) => {
        // Sets a modifier for a subsequent event emission that the
        // event data will only be broadcast to every sockets that
        // join the 'tag' room but the sender.
        socket.broadcast.to(tag).emit('receive-changes', delta)
      })

      // // Save document 1
      // socket.on('save-document', async (body) => {
      //   console.log('Save document listener executed!')
      //   try {
      //     if (versionId) {
      //       await DocumentModel.findOneAndUpdate({ etag: tag, 'versions.versionId': versionId }, {
      //         $set: {
      //           'versions.$.body': body
      //         }
      //       })
      //     } else {
      //       await DocumentModel.findOneAndUpdate({ etag: tag, body: body })
      //     }
      //   } catch (error) {
      //     return error
      //   }
      // })

      // Save document 2
      socket.on('save-document-disconnect', async (bucketName, key, delta) => {
        // console.log('Save document listener executed!')

        const html = await getHtmlFromDelta(delta)
        const docxFile = await HTMLtoDOCX(html)

        if (!bucketName || !key || !docxFile) return
        try {
          if (versionId) {
            await DocumentModel.findOneAndUpdate({ etag: tag, path: key, 'versions.versionId': versionId }, {
              $set: {
                'versions.$.body': delta
              }
            })
          } else {
            // console.log('Inside save document latest version...')
            // find document by tag and save delta in Mongo DB
            await DocumentModel.findOneAndUpdate({ etag: tag, path: key, body: delta })

            // Upload file to bucket
            const data = await s3
              .upload({
                Bucket: bucketName,
                Key: key,
                Body: docxFile
              })
              .promise()
            // console.log('Successfully upload file to s3!')
            // console.log(data)

            // If data do not have a location prop return an error
            if (!data.Location) {
              return new Error('No data found to upload the file!')
            }
            socket.disconnect(true)
          }
        } catch (error) {
          return error
        }
        socket.disconnect(true)
      })
    } catch (error) {
      return error
      // return error.message
    }
  }

  // const saveDocumentAndDisconnect = async (bucketName = null, key = null, delta = null) => {
  //   const html = convertDeltaToHtml(delta)
  //   // const htmlBuffer = Buffer.from(html)
  //   // console.log(htmlBuffer.length)
  //   const docxFile = await HTMLtoDOCX(html)

  //   if (!bucketName || !key || !docxFile) return

  //   try {
  //     // Find document by path and update it in database
  //     await DocumentModel.findOneAndUpdate({ path: key, body: delta })

  //     // // Upload file to bucket
  //     // const data = await s3
  //     //   .upload({
  //     //     Bucket: bucketName,
  //     //     Key: key,
  //     //     Body: docxFile
  //     //   })
  //     //   .promise()

  //     // // If data do not have a location prop return an error
  //     // if (!data.Location) {
  //     //   return new Error('No data found to upload the file!')
  //     // }
  //     socket.disconnect(true)
  //   } catch (error) {
  //     return error
  //   }
  //   socket.disconnect(true)
  // }

  // Get document event
  socket.on('get-s3-document', getS3Document)
  // socket.on('myerror', (error) => {
  //   console.log(error.message)
  //   // socket.emit('catch-error', error)
  // })
  // socket.on('save-and-disconnect', saveDocumentAndDisconnect)
  socket.on('disconnect', (reason) => {
    console.log(`A user has disconnected: ${reason}`)
  })
}
