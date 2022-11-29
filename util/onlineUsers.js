'use strict'
const uniqolor = require('uniqolor')
// [{
//   id: 'sdfgsdfgsdfg',
//   room: 'asdfs',
//   document: 'document name.docx'
//   userColor: { color: "#5cc653", isLight: true },
//   editionId: undefined
// }]

class UsersOnline {
  constructor () {
    this.users = []
  }

  /**
   * Add a new socket user
   * @param {string} id socket id connected
   * @param {string} room document draft id
   * @param {string} document filename
   */
  addUser (id, room, document) {
    const userColor = uniqolor(id)
    const user = { id, room, document, userColor, editionId: undefined }
    this.users.push(user)
    // return user
  }

  updateUser (id, editionId) {
    for (const user of this.getUserList()) {
      if (user.id === id) {
        user.editionId = editionId

        break
      }
    }
  }

  getUserList (room = undefined) {
    const users = this.users.filter((user) => user.room === room)
    // const idsArray = users.map((user) => user.id)

    return users
  }

  getUser (id) {
    const user = this.users.find((user) => user.id === id)
    console.log('user gotted')
    // console.log(user)
    return user
  }

  removeUser (id) {
    const user = this.getUser(id)

    if (user) {
      this.users = this.users.filter((user) => user.id !== id)
    }
    return user
  }
}

module.exports = UsersOnline
