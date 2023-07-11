'use strict'
const app = require('../app')
// eslint-disable-next-line camelcase
const { Server } = require('socket.io')
const http = require('http');
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})
const { port, endpoint, dbHost } = require('../config/configurations');
const  sequelize = require('../config/db-connection');

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

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
    sequelize.sync(); 
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

// Listen to server
server.listen(port, () => {
  port
    ? console.log(
        // eslint-disable-next-line camelcase
        `Express server running on port: ${port}, endpoint: ${endpoint}, env: ${process.env.NODE_ENV}, db_host: ${dbHost}`
      )
    : console.log('Error connecting to server!')
})
