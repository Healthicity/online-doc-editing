'use strict'
const Wlogger = require('../config/winston')
const s3 = require('../util/s3')
const mime = require('mime-types')
const getVersionsByObject = require('../middlewares/getVersionsByObject')
const fs = require('fs')
const FileType = require('file-type')
const handleError = require('../middlewares/handleError')
const { convertToHtml, uploadToS3, bufferToDelta } = require('../middlewares/documents/convertToDeltaFormat')
const fsPromises = require('fs/promises')

class S3Bucket {
  /**
   * Returns a list of all buckets owned by the authenticated sender of the request.
   */
  static async allBuckets (req, res, next) {
    try {
      // Call s3 function to list all buckets
      const { Buckets } = await s3.listBuckets().promise()

      Wlogger.info(`Method: ${req.method}, Endpoint: ${req.originalUrl}`)

      // In case buckets were not found
      if (!Buckets) { return next({ status: 404, message: 'Buckets were not found!' }) }

      // Return all buckets
      return res.status(200).send(Buckets)
    } catch (error) {
      // Return a 500 error
      return next({
        status: 500,
        message: `An error occured: ${error.message}`,
        error: error.message
      })
    }
  }

  /**
   * Returns some or all (up to 1,000) of the objects with their versions in a bucket.
   * You can use the request parameters as selection criteria to return a subset of the objects in a bucket.
   * @param bucket: Name of the bucket
   * @param max: Number of objects to retrieve
   */
  static async allObjects (req, res, next) {
    // Get query params
    const { bucket, max } = req.query
    try {
      // Call s3 function to list all objects
      const data = await s3
        .listObjects({ Bucket: bucket, MaxKeys: max || 30 })
        .promise()
      Wlogger.info(`Method: ${req.method}, Endpoint: ${req.originalUrl}`)

      // In case no data was found
      if (!data) {
        return next({
          status: 404,
          apiMessage: 'Data is empty',
          friendlyMessage: `Objects for bucket ${bucket} were not found!`,
          errorName: 'Data not found!'
        })
      }

      // Data of all objects converted to a specific object to be thrown
      const updateData = data.Contents.map(async (doc, index) => {
        try {
          const bucket = data.Name
          const contentType = mime.lookup(doc.Key)
          const extension = mime.extension(contentType)
          const versions = await getVersionsByObject(doc.Key)
          return { ...doc, contentType, extension, bucket, versions }
        } catch (error) {
          return new Error('An error occured executing the getVersionsByObject function!')
        }
      })
      const dataValues = await Promise.all(updateData)
      // Successfully return objects
      return res.status(200).send(dataValues)
    } catch (error) {
      // Destructure error object
      const { statusCode, message, name } = error
      // Return an error
      return next({
        status: statusCode,
        apiMessage: message,
        friendlyMessage: `An error occured getting the objects from bucket: ${bucket}`,
        errorName: name
      })
    }
  }

  /**
   * This method retreives all delete markers objects
   * @param {string} bucket: NAme of the bucket
   * @returns Object
   */
  static async allDeleteMarkers (req, res, next) {
    // Get query params
    const { bucket } = req.query

    try {
      // Call s3 function to list all object versions that has deleted markers
      const { DeleteMarkers } = await s3
        .listObjectVersions({ Bucket: bucket })
        .promise()

      Wlogger.info(`Method: ${req.method}, Endpoint: ${req.originalUrl}`)

      // In case no data was found
      if (!DeleteMarkers) {
        return next({
          status: 404,
          friendlyMessage: `Object versions for bucket ${bucket} was not found!`
        })
      }

      // Return all object versions successfully
      return res.status(200).send(DeleteMarkers)
    } catch (error) {
      const { statusCode, message, name } = error
      // Return an error
      return next({
        status: statusCode,
        apiMessage: message,
        friendlyMessage: `An error occured getting the deleted markers in bucket: ${bucket}`,
        errorName: name
      })
    }
  }

  /**
   * Get all versions of an object with specific key name prefix.
   * The request limits the number of items returned to two. If there are are more than two object version, S3 returns NextToken in the response.
   * You can specify this token value in your next request to fetch next set of object versions.
   */
  static async allObjectVersions (req, res, next) {
    // Get query params
    const { bucket, prefix } = req.query

    try {
      // Call s3 function to list all object versions
      const { Versions } = await s3
        .listObjectVersions({ Bucket: bucket, Prefix: prefix })
        .promise()

      Wlogger.info(`Method: ${req.method}, Endpoint: ${req.originalUrl}`)

      // In case no data was found
      if (!Versions.length) {
        return next({
          status: 404,
          apiMessage: 'Versions were not found!',
          friendlyMessage: `Object versions from bucket ${bucket} and prefix ${prefix} were not found!`,
          errorName: 'Not Found'
        })
      }

      // Return all object versions successfully
      return res.status(200).send(Versions)
    } catch (error) {
      const { statusCode, message, name } = error
      // Return an error
      return next({
        status: statusCode,
        apiMessage: message,
        friendlyMessage: `An error occured getting the object versions from prefix: ${prefix}`,
        errorName: name
      })
    }
  }

  // Get one object from one specific bucket, providing the key object
  /**
   * @param bucket: Name of the bucket
   * @param key: Path of the file, example: doc-api-folder/Content Info Globalesm Website.docx
   * @param versionId: A specific object version id
   */
  static async oneObject (req, res, next) {
    // Get required query params to get one object
    const { bucket, key, versionId } = req.query
    // const versionId = req.params.versionId

    try {
      // Call s3 function to get one specific object
      const data = await s3
        .getObject(versionId ? { Bucket: bucket, Key: key, VersionId: versionId } : { Bucket: bucket, Key: key })
        .promise()

      Wlogger.info(`Method: ${req.method}, Endpoint: ${req.originalUrl}`)

      if (!data) {
        return next({
          status: 404,
          apiMessage: 'Object version was not found!',
          friendlyMessage: `Object key ${key} with versionId ${versionId} was not found!`,
          errorName: 'Not Found'
        })
      }

      // // Return data
      return res.status(200).send(data)
    } catch (error) {
      const { statusCode, message, name } = error
      // Return an error
      return next({
        status: statusCode,
        apiMessage: message,
        friendlyMessage: 'Document name or versionId are incorrect, please check them.',
        errorName: name
      })
    }
  }

  // Upload a file to an S3 bucket
  /**
   * @param bucketName: Bucket name (include folder name if your file will be store inside a folder)
   * @param filename: Name of the file
   */
  static async uploadFile (req, res, next) {
    // Get the required body params: Bucket name and file name
    const { originalname, path: filePath } = req.file
    const { bucketName } = req.body

    const fileType = await FileType.fromFile(filePath)
    const newFilename = originalname.split('.').slice(0, -1).join('.') + '.' + fileType.ext

    try {
      // Validate if the uploaded filename exist in bucket
      const fileExist = await s3.headObject({ Bucket: bucketName, Key: newFilename }).promise()

      // Check if file already exist in s3 bucket
      if (fileExist || Object.keys(fileExist).length > 0) {
        // Remove local upload file from disk
        await fsPromises.unlink(filePath)
        return next(handleError(400, `A file with name: ${newFilename} already exist!`))
      }
    } catch (err) { // If filename doesn't exist in s3 bucket
      try {
        // Upload a new file to bucket
        // Create a read stream of the file
        const fileStream = fs.createReadStream(filePath, 'binary')

        // Start read streaming file
        fileStream.on('error', (err) => {
          console.log(err.message)
          return res.send(err)
        })
          .pipe(uploadToS3(s3, bucketName, newFilename))
          .pipe(convertToHtml(newFilename, fileType.ext, () => fsPromises.unlink(filePath)))
          .pipe(res.status(201))
      } catch (error) { // If something occurrs uploading the new file
        const { statusCode, message, name } = error
        // Return an error
        return next(handleError(statusCode, `An error occured uploading the file: ${newFilename} to bucket: ${bucketName}`, message, name))
      }
    }
  }

  // static async updateObject (req, res, next) {
  //   const { bucket, key, versionId, tag } = req.body

  //   try {
  //     const data = await DocumentModel.findOne({ etag: tag, path: key }).exec()

  //     if (!Object.keys(data).length) return res.status(404).send('No data in Mongo db!')

  //     const versionData = data.versions.find(version => version.versionId === versionId)
  //     // const data = await s3.getObject({ Bucket: bucket, Key: key, VersionId: versionId })
  //     // .promise()
  //     console.log(versionData)
  //     // Upload file to bucket
  //     const dataUpdated = await s3
  //       .putObject({
  //         Bucket: bucket,
  //         Key: key,
  //         Body: versionData.content.buffer
  //       })
  //       .promise()

  //     // If data do not have a location prop return an error
  //     if (!dataUpdated) {
  //       return next({
  //         status: 404,
  //         friendlyMessage: 'No data found to update this document!'
  //       })
  //     }

  //     // File upload successfully
  //     return res.status(201).send({ data: dataUpdated, message: `The file was successfully restored to latest version: ${dataUpdated.VersionId}.` })
  //   } catch (error) {
  //     const { statusCode, message, name } = error
  //     // Return an error
  //     return next({
  //       status: statusCode,
  //       apiMessage: message,
  //       friendlyMessage: `An error occured updating the document: ${key} to bucket: ${bucket}`,
  //       errorName: name
  //     })
  //   }
  // }

  /**
   * The following example deletes an object from an S3 bucket.
   * @param bucket: name of the bucket
   * @param key: key name of the object to delete
   * @param versionId: version id of the object to delete (optional)
   */
  static async deleteObject (req, res, next) {
    // Get the required body params: Bucket name and file name
    const { bucket, key, versionId } = req.query

    try {
      // TODO: Search key and versionId in s3 bucket to valid if it exist
      const data = await s3
        .deleteObject(versionId
          ? { Bucket: bucket, Key: key, VersionId: versionId }
          : { Bucket: bucket, Key: key })
        .promise()

      if (!data) return next({ status: 404, friendlyMessage: `File with name: ${key} and versionId: ${versionId} was not found!` })

      // eslint-disable-next-line no-prototype-builtins
      if (data.hasOwnProperty('DeleteMarker') && !versionId) return res.status(201).send({ data, message: `Document: ${key} successfully sent to trash.` })
      // eslint-disable-next-line no-prototype-builtins
      else if (data.hasOwnProperty('VersionId')) return res.status(201).send({ data, message: `Version: ${versionId} of ${key} permanently deleted!` })
    } catch (error) {
      const { statusCode, message, name } = error
      // Return an error
      return next({
        status: statusCode,
        apiMessage: message,
        friendlyMessage: `An error occured deleting the object: ${key} with versionId: ${versionId}`,
        errorName: name
      })
    }
  }

  /**
   * Restore a specific object
   * @param bucket: name of the bucket
   * @param key: key name of the object to delete
   * @param versionId: version id of the object that has delete marker (must be only the one that has the delete marker)
   */
  static async restoreObject (req, res, next) {
    // Get the required body params: Bucket name and file name
    const { bucket, key, versionId } = req.query

    try {
      // TODO: Search key and versionId in s3 bucket to valid if it exist
      const data = await s3
        .deleteObject({ Bucket: bucket, Key: key, VersionId: versionId })
        .promise()

      if (!data) {
        return next({
          status: 404,
          apiMessage: 'Version not found',
          friendlyMessage: 'Document name or versionId are incorrect, please check them.',
          errorName: 'Not Found'
        })
      }

      return res.status(200).send({ message: `Document: ${key} successfully restored!` })
    } catch (err) {
      const { statusCode, message, name } = err
      // Return an error
      return next({
        status: statusCode,
        apiMessage: message,
        friendlyMessage: `An error occured restoring the document: ${key} with versionId: ${versionId}`,
        errorName: name
      })
    }
  }

  static async checkFile (bucketName, originalname) {
    try {
      return await s3.headObject({ Bucket: bucketName, Key: originalname }).promise()
    } catch (err) {
      return false
    }
  }

  /**
   * Upload file in S3
   */
  static async upFile (req, res, next) {
    const { originalname, path } = req.file
    const { bucketName } = req.body

    try {
      const exists = await S3Bucket.checkFile(bucketName, originalname)

      if (exists) {
        fs.unlinkSync(path)

        return next(handleError(400, `A file with name: ${originalname} already exists!`))
      }

      const s3Object = await s3.upload({
        Bucket: bucketName,
        Key: originalname,
        Body: fs.createReadStream(path)
      }).promise()

      const fileType = await FileType.fromFile(path)
      const buffer = fs.readFileSync(path)

      await bufferToDelta(originalname, fileType.ext, buffer, s3Object)

      fs.unlinkSync(path)

      return res.status(201).send({ message: 'File uploaded' })
    } catch (err) {
      return next(handleError(err.statusCode || 500, err.message || 'Error uploading file'))
    }
  }
}

module.exports = S3Bucket
