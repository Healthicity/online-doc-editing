'use strict'
const s3 = require('../util/s3')
const bucket = process.env.S3_BUCKET;

module.exports = (key) => {
  return new Promise((resolve, reject) => {
    if (key) {
      resolve(getObjectVersions(key))
    } else return reject(new Error('An error occured: The argument key was not found!'))
  })
}

const getObjectVersions = async (key) => {
  try {
    // Call s3 function to list all object versions
    const { Versions } = await s3
      .listObjectVersions({ Bucket: bucket, Prefix: key })
      .promise()
    // Return all object versions successfully
    return Versions
  } catch (error) {
    // Return a 500 error
    return error
  }
}
