'use strict'
// const registerDocumentHandlers = require('./document.handler')
// const OnlineUsers = require('../util/onlineUsers')
// const onlineUsers = new OnlineUsers()

const onConnection = (socket) => {
  console.log(`New socket connection: ${socket.id}`)
  // console.log(socket)
  // registerDocumentHandlers(io, socket)
  // registerS3DocumentHandlers(io, socket)
  // registerDocumentHandlers(io, socket)
  // socket.on('disconnect', () => {
  //   console.log(socket.id, 'disconnected')
  // })
}

module.exports = onConnection
