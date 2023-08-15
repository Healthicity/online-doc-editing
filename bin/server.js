'use strict'
const app = require('../app')
// eslint-disable-next-line camelcase
const { port, endpoint, db_mongo_host } = require('../config/config-env')
const { Server } = require('socket.io')
const mongoConnection = require('../config/mongo-connection')
const http = require('http')
var jwt = require('jsonwebtoken');
const sequelize = require('../config/db-connection');
const server = http.createServer(app)
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: new RegExp(process.env.CORS_ORIGIN, "i"),
    methods: ['GET', 'POST']
  }
})
const AuthenticationTokenModel = require('../models/authentication_token')

io.use((socket, next) => {
  const auth_token = socket.handshake.auth.token;
  AuthenticationTokenModel.findOne({ token: auth_token }).then((authentication_token) => {
    if(authentication_token?.token == auth_token) {
      console.log("Authenticated")
      const access_token = socket.handshake.headers.authorization.split(' ')[1];
      const payload = jwt.verify(access_token, process.env.JWT_SECRET);
      socket.data.user_id = payload.user_id;
      socket.data.document_id = payload.document_id;
      next();
    } else {
      console.log("Unauthorized")
      console.log("Authentication Token: " + auth_token)
      socket.disconnect("unauthorized")
      return next(new Error('authentication error'));
    }
  })
});

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
        `Express server running on port: ${port}, endpoint: ${endpoint}, env: ${process.env.NODE_ENV}, db_host: ${db_mongo_host}`
      )
    : console.log('Error connecting to server!')
})
