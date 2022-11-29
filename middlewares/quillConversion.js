'use strict'
const { convertHtmlToDelta, convertDeltaToHtml } = require('node-quill-converter')

const getDeltaFromHtml = (html) => {
  return new Promise((resolve, reject) => {
    try {
      console.log('Converting html to delta')
      const delta = convertHtmlToDelta(html)
      return resolve(delta)
    } catch (error) {
      console.log('An error occured!')
      console.log(error)
      return reject(error)
    }
  })
}

const getHtmlFromDelta = (delta) => {
  return new Promise((resolve, reject) => {
    try {
      console.log('Converting delta to html')
      const html = convertDeltaToHtml(delta)
      resolve(html)
    } catch (error) {
      console.log('An error occured!')
      console.log(error)
      reject(error)
    }
  })
}

module.exports = {
  getDeltaFromHtml,
  getHtmlFromDelta
}
