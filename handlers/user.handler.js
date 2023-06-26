const UserModel = require('../models/user')

module.exports = (io, socket) => {
  const getUsers = async () => {
    try {
      const users = await UserModel.find()
      console.log(users)
      io.emit('user:getAll', users)
    } catch (error) {
      // const friendlyMessage = 'Ups, it was not possible to get users from db.'
    }
  }

  const createUser = async (payload) => {
    console.log(payload)
    const newUser = new UserModel(payload)
    const userCreated = await newUser.save()
    console.log(userCreated)
    io.emit('user:create', userCreated)
  }

  getUsers()
  socket.on('users:createOne', createUser)
}
