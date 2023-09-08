'use strict'
const HTMLtoDOCX = require('html-to-docx')
const DraftDocumentModel = require('../models/document_draft.model')
const DocumentVersionModel = require('../models/document_version.model')
// const EditionModel = require('../models/edition.model')
const { getDeltaFromHtml, getHtmlFromDelta } = require('../middlewares/quillConversion')

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
        .populate('users')

      if (!draftDocument) {
        throw new Error(`No draft document with id: ${draftId}`)
      }

      if (!draftDocument.html && draftDocument.body) {
        draftDocument.html = await getHtmlFromDelta(draftDocument.body)
      }

      // Make all socket instances join the same room document
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
      socket.on('documents:sendDraftChanges', async (delta, html) => {
        // onlineDoc.updateDoc(oldDelta, data)
        delta = delta || await getDeltaFromHtml(html)
        html = html || await getHtmlFromDelta(delta)

        // Sets a modifier for a subsequent event emission that the
        // event data will only be broadcast to every sockets that
        // join the 'tag' room but the sender.
        socket.broadcast.to(draftId).emit('documents:receiveDraftChanges', delta, html)
        // io.to(draftId).emit('documents:receiveSavedDocument', socket.id, 'Saved changes!')
        saveDocumentContent(draftId, delta, html)
      })

      socket.on('documents:cursorChange', (id, range) => {
        const userCursor = onlineUsers.getUser(id)
        socket.to(draftId).emit('documents:receiveCursorChange', userCursor, range)
      })

      // socket.on('documents:saveNewVersion', (draftId, body) => {
      //   saveNewDocumentVersion(draftId, body)
      // })

      socket.on('documents:saveNewVersion', saveNewDocumentVersion(draftId)) // Save document when editor text changed
    } catch (error) {
      console.error('An error occured in getDraftDocumentById method')
      console.error(error.message)
      return error
    }
  }

  const findOrCreateVersion = async (documentId, draftDocument, draftId) => {
    if (documentId === null) return

    const [latestVersion] = await DocumentVersionModel.find({ documentId: documentId }, 'etag versionId body createdAt updatedAt').sort({ createdAt: -1 }).limit(1)

    if (!latestVersion) {
      // Call s3 function to get one specific object
      try {
        const data = await s3
          .getObject({ Bucket: process.env.S3_BUCKET, Key: draftDocument.filename })
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
          html: draftDocument.html,
          documentId: documentId,
          versionId: data.VersionId
        })

        const versionSaved = await newDocumentVersion.save()

        onlineDoc.addDocument(draftId, draftDocument.filename, versionSaved)
      } catch (err) {
        console.error('An error occurred in getDraftDocumentById method')
        console.log(err)
      }
    } else {
      onlineDoc.addDocument(draftId, draftDocument.filename, latestVersion)
    }
  }

  const saveDocumentContent = async (draftId, delta, html) => {
    if (!delta || !html) return

    const data = html || await getHtmlFromDelta(delta)

    const buffer = await HTMLtoDOCX(data, null, {
      table: { row: { cantSplit: true } },
      font: 'Helvetica',
      fontSize: 28
    })

    try {
      console.log('saving document...')
      await DraftDocumentModel.findByIdAndUpdate(draftId, {
        $set: {
          body: delta,
          content: buffer,
          html
        }
      })
      const currentUser = onlineUsers.getUser(socket.id)
      io.to(draftId).emit('documents:receiveSavedDocument', currentUser, 'Saved changes!') // quizas pueda borrar esta emit

      // Save edition of user
      // saveDocumentEdition(draftId, currentUser, edition)

      // // Save a new version of the document draft
      // saveNewDocumentVersion(draftId, body)
    } catch (error) {
      console.error('An error occurred in saveDocumentContent method')
      console.error(error.message)
      return error
    }
  }
  // TODO:
  // Compare delta body to delta body from the latest version stored in database.
  const saveNewDocumentVersion = (draftId) => async (delta, html) => {
    if (draftId === null) return

    const isSameData = delta
      ? util.isDeepStrictEqual(onlineDoc.getDocument().latestVersion.body, delta)
      : util.isDeepStrictEqual(onlineDoc.getDocument().latestVersion.html, html)

    if (!isSameData) {
      console.log('Body is different as the latest version')
      // SAVE NEW VERSION IN DATABASE
      try {
      // Get draft document by id from database
        const draftDocument = await DraftDocumentModel.findById(draftId, 'filename etag lastModified body content html documentId')

        // Upload new version of same filename to bucket
        const data = await s3
          .putObject({
            Bucket: process.env.S3_BUCKET,
            Key: draftDocument.filename,
            Body: draftDocument.content
          })
          .promise()

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
          html,
          documentId: draftDocument.documentId,
          versionId: data.VersionId,
          isLatest: true,
          userId: socket.data.user_id

        })

        await newDocumentVersion.save()

        onlineDoc.updateDoc(newDocumentVersion)
      } catch (error) {
        console.error('An error occured in saveDocumentContent method')
        console.error(error.message)
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
  socket.on('disconnect', () => {
    console.log(socket.id, 'disconnected')
    const removedUser = onlineUsers.removeUser(socket.id)
    io.emit('documents:getOnlineUsers', onlineUsers.getUserList(removedUser?.room))
    io.to(removedUser?.room).emit('documents:removeCursor', removedUser)
  })
}
