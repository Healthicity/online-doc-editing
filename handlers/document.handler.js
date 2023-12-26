'use strict'

const DraftDocumentModel = require('../models/document_draft')
const DocumentVersionModel = require('../models/document_version')

const OnlineUsers = require('../util/onlineUsers')
const onlineUsers = new OnlineUsers()
const OnlineDocument = require('../util/onlineDocument')
const onlineDoc = new OnlineDocument()

module.exports = (io, socket) => {
  const getDraftDocumentById = async (draftId) => {
    if (draftId === null) return

    try {
      // Get draft document by id from database
      const draftDocument = await DraftDocumentModel.findById(draftId)

      if (!draftDocument) {
        throw new Error(`No draft document with id: ${draftId}`)
      }

      // Make all socket isnstances join the same room document
      // with the specific tag
      socket.join(draftId)
      onlineUsers.removeUser(socket.id)
      onlineUsers.addUser(socket.id, draftId, draftDocument.filename)
      findOrCreateVersion(draftDocument.documentId.toString(), draftDocument, draftId)

      const draftDocumentStringified = draftDocument.toObject()
      draftDocumentStringified.users = await draftDocument.populateUsers()

      socket.emit('documents:getDraftDocument', draftDocumentStringified)

      // Get online users
      io.to(draftId).emit('documents:getOnlineUsers', onlineUsers.getUserList(draftId))

      // Send updated changes
      socket.on('documents:sendDraftChanges', async (docDetails) => {
        // Sets a modifier for a subsequent event emission that the
        // event data will only be broadcast to every sockets that
        // join the 'tag' room but the sender.
        socket.broadcast.to(draftId).emit('documents:receiveDraftChanges', docDetails)
        saveDocumentContent(draftId, docDetails)
      })
    } catch (error) {
      console.error('An error occured in getDraftDocumentById method')
      console.error(error.message)
      return error
    }
  }

  const findOrCreateVersion = async (documentId, draftDocument, draftId) => {
    if (documentId === null) return

    const [latestVersion] = await DocumentVersionModel.find({ documentId }, 'isLatest html header footer').sort({ createdAt: -1 }).limit(1)
  
    if (!latestVersion) {
      const draftDocument = await DraftDocumentModel.findById(draftId)
      const newDocumentVersion = new DocumentVersionModel({
        lastModified: new Date(),
        html: draftDocument.html,
        header: draftDocument.header,
        footer: draftDocument.footer,
        documentId,
        userId: socket.data.user_id,
        draftDocumentId: draftDocument._id
      })

      const versionSaved = await newDocumentVersion.save()
      onlineDoc.addDocument(draftId, draftDocument.filename, versionSaved)
    } else {
      onlineDoc.addDocument(draftId, draftDocument.filename, latestVersion)
    }
  }

  const saveDocumentContent = async (draftId, docDetails) => {
    if (!docDetails) return

    try {
      console.log('saving document...')
      const draftDocument = await DraftDocumentModel.findById(draftId)
      let userIds = draftDocument.userIds
      userIds.push(socket.data.user_id)
      userIds = [...new Set(userIds)]
      await draftDocument.update({
        userIds,
        html: docDetails.content,
        header: docDetails.header,
        footer: docDetails.footer
      })
      saveNewDocumentVersion(draftId, docDetails)
      const currentUser = onlineUsers.getUser(socket.id)
      io.to(draftId).emit('documents:receiveSavedDocument', currentUser, 'Saved changes!')

    } catch (error) {
      console.error('An error occured in saveDocumentContent method')
      console.error(error.message)
      return error
    }
  }

  const saveNewDocumentVersion = async (draftId, docDetails) => {
    if (draftId === null) return

    const isSameContentData = docDetails.content && onlineDoc.getDocument().latestVersion.html === docDetails.content;
    const isSameHeaderData = docDetails.header && onlineDoc.getDocument().latestVersion.header === docDetails.header;
    const isSameFooterData = docDetails.footer && onlineDoc.getDocument().latestVersion.footer === docDetails.footer;

    if (!isSameContentData || !isSameHeaderData || !isSameFooterData) {
      // SAVE NEW VERSION IN DATABASE
      try {
        await DraftDocumentModel.findByIdAndUpdate(draftId, {
          $set: {
            html: docDetails.content,
            header: docDetails.header,
            footer: docDetails.footer
          }
        })

        const draftDocument = await DraftDocumentModel.findById(draftId)

        const newDocumentVersion = new DocumentVersionModel({
          lastModified: new Date(),
          html: docDetails.content,
          header: docDetails.header,
          footer: docDetails.footer,
          userId: socket.data.user_id,
          documentId: draftDocument.documentId,
          draftDocumentId: draftDocument._id
        })

        await newDocumentVersion.save()

        onlineDoc.updateDoc(newDocumentVersion)
      } catch (error) {
        console.error('An error occured in saveNewDocumentVersion method')
        console.error(error.message)
        return error
      }
    }
  }

  // DOCUMENT LISTENERS ---------------------------------
  socket.on('documents:getDraftDocumentById', getDraftDocumentById) // Get draft document by id

  // When a user disconnects
  socket.on('disconnect', (reason) => {
    console.log(socket.id, 'disconnected')
    console.log(`A user has disconnected: ${reason}`)

    const removedUser = onlineUsers.removeUser(socket.id)
    if (!removedUser) return
    io.emit('documents:getOnlineUsers', onlineUsers.getUserList(removedUser.room))
    io.to(removedUser.room).emit('documents:removeCursor', removedUser)
  })
}
