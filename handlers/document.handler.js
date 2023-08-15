'use strict'

const DraftDocumentModel = require('../models/document_draft')
const DocumentVersionModel = require('../models/document_version')

const { getHtmlFromDelta } = require('../middlewares/quillConversion')
const HTMLtoDOCX = require('html-docx-js')

const OnlineUsers = require('../util/onlineUsers')
const onlineUsers = new OnlineUsers()
const OnlineDocument = require('../util/onlineDocument')
const onlineDoc = new OnlineDocument()

const s3 = require('../util/s3')
const util = require('util')

module.exports = (io, socket) => {
  const getDraftDocumentById = async (draftId) => {
    if (draftId === null) return

    try {
      // Get draft document by id from database
      const draftDocument = await DraftDocumentModel.findById(draftId)
        .populate('stateId')
            
      if (!draftDocument) {
        throw new Error(`No draft document with id: ${draftId}`)
      }

      // Make all socket isnstances join the same room document
      // with the specific tag
      socket.join(draftId)
      onlineUsers.removeUser(socket.id)
      onlineUsers.addUser(socket.id, draftId, draftDocument.filename)
      findOrCreateVersion(draftDocument.documentId.toString(), draftDocument, draftId)

      var draftDocumentStringified = draftDocument.toObject();
      draftDocumentStringified.users = await draftDocument.populateUsers();

      socket.emit('documents:getDraftDocument', draftDocumentStringified)

      // Get online users
      io.to(draftId).emit('documents:getOnlineUsers', onlineUsers.getUserList(draftId))

      // Send updated changes
      socket.on('documents:sendDraftChanges', async (delta, oldDelta, data) => {
        // onlineDoc.updateDoc(oldDelta, data)

        // Sets a modifier for a subsequent event emission that the
        // event data will only be broadcast to every sockets that
        // join the 'tag' room but the sender.
        socket.broadcast.to(draftId).emit('documents:receiveDraftChanges', delta)
        // io.to(draftId).emit('documents:receiveSavedDocument', socket.id, 'Saved changes!')
        saveDocumentContent(draftId, data)
      })

      socket.on('documents:cursorChange', (id, range) => {
        const userCursor = onlineUsers.getUser(id)
        socket.to(draftId).emit('documents:receiveCursorChange', userCursor, range)
      })

      // socket.on('documents:saveNewVersion', (draftId, body) => {
      //   saveNewDocumentVersion(draftId, body)
      // })

      socket.on('documents:saveNewVersion', saveNewDocumentVersion) // Save document when editor text changed
    } catch (error) {
      console.log('An error occured in getDraftDocumentById method')
      console.log(error.message)
      return error
    }
  }

  const findOrCreateVersion = async (documentId, draftDocument, draftId) => {
    if (documentId === null) return

    const [latestVersion] = await DocumentVersionModel.find({ documentId: documentId }, 'etag versionId body createdAt updatedAt').sort({ createdAt: -1 }).limit(1)
    if (!latestVersion) {
      // Call s3 function to get one specific object
      const data = await s3
        .getObject({ Bucket: process.env.S3_BUCKET, Key: draftDocument.path })
        .promise()

      // If data do not have a location prop return an error
      if (data === null || !Object.keys(data).length) {
        throw new Error('No data version')
      }
      const etag = data.ETag.substring(1, data.ETag.length - 1)

      const newDocumentVersion = new DocumentVersionModel({
        etag: etag,
        lastModified: data.LastModified,
        content: data.Body,
        body: draftDocument.body,
        documentId: documentId,
        versionId: data.VersionId
      })

      const versionSaved = await newDocumentVersion.save()
      onlineDoc.addDocument(draftId, draftDocument.filename, versionSaved)
    } else {
      onlineDoc.addDocument(draftId, draftDocument.filename, latestVersion)
    }
  }

  const saveDocumentContent = async (draftId, body) => {
    if (body === null || !Object.keys(body).length) return

    try {
      console.log('saving document...')
      await DraftDocumentModel.findByIdAndUpdate(draftId, {
        $set: {
          body: body
        }
      })
      const currentUser = onlineUsers.getUser(socket.id)
      io.to(draftId).emit('documents:receiveSavedDocument', currentUser, 'Saved changes!')

      // Save edition of user
      // saveDocumentEdition(draftId, currentUser, edition)

      // // Save a new version of the document draft
      // saveNewDocumentVersion(draftId, body)
    } catch (error) {
      console.log('An error occured in saveDocumentContent method')
      console.log(error.message)
      return error
    }
  }
  // TODO:
  // Compare delta body to delta body from the latest version stored in database.
  const saveNewDocumentVersion = async (draftId, currentDelta) => {
    if (draftId === null) return

    // console.log(onlineDoc.getDocument().latestVersion.body)
    // console.log(currentDelta)
    const isSameDelta = util.isDeepStrictEqual(onlineDoc.getDocument().latestVersion.body, currentDelta)
    // console.log(isSameDelta)

    if (!isSameDelta) {
      console.log('Body is different as the latest version')
      // SAVE NEW VERSION IN DATABASE
      try {
      // Get draft document by id from database
        const draftDocument = await DraftDocumentModel.findById(draftId, 'filename etag lastModified body content documentId path')

        const html = await getHtmlFromDelta(draftDocument.body)
        const docxFile = HTMLtoDOCX.asBlob(html)

        // Upload new version of same filename to bucket
        const data = await s3
          .putObject({
            Bucket: process.env.S3_BUCKET,
            Key: draftDocument.path,
            Body: docxFile
          })
          .promise()

        await DraftDocumentModel.findByIdAndUpdate(draftId, {
          $set: {
            content: docxFile
          }
        })

        // If data do not have a location prop return an error
        if (data === null || !Object.keys(data).length) {
          throw new Error('No data version')
        }
        const etag = data.ETag.substring(1, data.ETag.length - 1)

        const newDocumentVersion = new DocumentVersionModel({
          etag: etag,
          lastModified: new Date(),
          content: draftDocument.content,
          body: draftDocument.body,
          documentId: draftDocument.documentId,
          versionId: data.VersionId,
          isLatest: true
        })

        await newDocumentVersion.save()

        onlineDoc.updateDoc(newDocumentVersion)
      } catch (error) {
        console.log('An error occured in saveNewDocumentVersion method')
        console.log(error.message)
        return error
      }
    }
  }

  // const saveDocumentEdition = async (draftId, currentUser, edition) => {
  //   if (!currentUser.editionId) return

  //   try {
  //     const userId = '6254609bade4d556f5b57e42'
  //     const edition = await EditionModel.findById(currentUser.editionId)
  //     if (edition) {
  //       await EditionModel.findByIdAndUpdate(currentUser.editionId, {
  //         $set: {
  //           body: edition
  //         }
  //       })
  //     } else {
  //       const newEdition = new EditionModel({
  //         documentDraftId: draftId,
  //         content: null,
  //         body: edition,
  //         userId: userId
  //       })

  //       const editionSaved = await newEdition.save()

  //       onlineUsers.updateUser(currentUser.id, editionSaved._id)

  //       // return editionSaved
  //     }
  //   } catch (error) {

  //   }
  // }

  // DOCUMENT LISTENERS ---------------------------------
  socket.on('documents:getDraftDocumentById', getDraftDocumentById) // Get draft document by id

  // When a user disconnects
  socket.on('disconnect', (reason) => {
    console.log(socket.id, 'disconnected');
    console.log(`A user has disconnected: ${reason}`);

    const removedUser = onlineUsers.removeUser(socket.id)
    if (!removedUser) return;
    
    io.emit('documents:getOnlineUsers', onlineUsers.getUserList(removedUser.room))
    io.to(removedUser.room).emit('documents:removeCursor', removedUser)
  })
}
