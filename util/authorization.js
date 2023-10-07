const jwt = require('jsonwebtoken')

function decryptAccessToken (socket) {
  const accessToken = socket.handshake.headers.authorization.split(' ')[1]
  return jwt.verify(accessToken, process.env.JWT_SECRET)
}

module.exports = {
  decryptAccessToken
}
