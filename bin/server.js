'use strict'
const app = require('../app')
// eslint-disable-next-line camelcase
const { port, endpoint, db_mongo_host } = require('../config/config-env')
const { Server } = require('socket.io')
const mongoConnection = require('../config/mongo-connection')
const http = require('http')
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://domain1.compliancemanager.lvh.me:3002',
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

// Database connection ----------------------------------
mongoConnection
  .then(() =>
    console.log('Connection to MongoDB successfully achieved!')
  )
  .catch((err) => console.log(`Connection to MongoDB rejected!: ${err}`))

// Listen to server
server.listen(port, () => {
  port
    ? console.log(
        // eslint-disable-next-line camelcase
        `Express server running on port: ${port}, endpoint: ${endpoint}, env: ${process.env.NODE_ENV}, db_host: ${db_mongo_host}`
      )
    : console.log('Error connecting to server!')
})
