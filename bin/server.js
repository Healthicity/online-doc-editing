'use strict'
const app = require('../app')
// eslint-disable-next-line camelcase
const { envPort, endpoint, dbHost } = require('../config/configurations');
const { Server } = require('socket.io')
const http = require('http');
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

// Socket Handlers ------------------------------------
const registerDocumentHandlers = require('../handlers/document.handler')
// Register handlers to socket connection
const onConnection = socket => {
  console.log(`New socket connection: ${socket.id}`)

  registerDocumentHandlers(io, socket)
}
// Socketio connection
io.on('connection', onConnection)


// Listen to server
server.listen(envPort, () => {
  envPort
    ? console.log(
        // eslint-disable-next-line camelcase
        `Express server running on port: ${envPort}, endpoint: ${endpoint}, env: ${process.env.NODE_ENV}, db_host: ${dbHost}`
      )
    : console.log('Error connecting to server!')
});