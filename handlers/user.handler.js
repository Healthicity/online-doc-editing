const UserModel = require('../models/user')

module.exports = (io, socket) => {

  const createUser = async (payload) => {
    console.log(payload)
    const newUser = new UserModel(payload)
    await newUser.save()
  }

  socket.on('users:createOne', createUser)
}
