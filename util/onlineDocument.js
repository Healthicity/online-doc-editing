'use strict'
// {
//   id: 'sdfgsdfgsdfg',
//   filename: 'document name.docx'
//   latestVersion: {},
//   previousDelta: {}
//   currentDelta: {},
// }

class OnlineDocument {
  constructor () {
    this.document = {}
  }

  /**
   * Add a new socket user
   * @param {string} id socket id connected
   * @param {string} filename filename
   * @param {string} latestVersion object
   */
  addDocument (id, filename, latestVersion = null) {
    const doc = { id, filename, latestVersion }
    this.document = doc
  }

  getDocument () {
    return this.document
  }

  updateDoc (latestVersion) {
    this.document.latestVersion = latestVersion
  }
}

module.exports = OnlineDocument
