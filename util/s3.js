const AWS = require('aws-sdk')
const { accessKeyId, secretAccessKey } = require('../config/config-env')

const s3 = new AWS.S3({
  accessKeyId,
  secretAccessKey
})

s3.config.update({ region: process.env.S3_REGION })

const readFile = (draftDocument) => {
  return new Promise(function (resolve, reject) {
      var params = { Bucket: draftDocument.bucket, Key: draftDocument.path };
      s3.getObject(params, function (err, data) {
        if (err) {
            reject(err.message);
        } else {
            var data = Buffer.from(data.Body)
            resolve(data);
        }
      });
  });
}

module.exports = { s3, readFile }