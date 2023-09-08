var jwt = require('jsonwebtoken');

function decryptAccessToken(socket) {
  const access_token = socket.handshake.headers.authorization.split(' ')[1];
  return jwt.verify(access_token, process.env.JWT_SECRET);
}

module.exports = {
  decryptAccessToken
}