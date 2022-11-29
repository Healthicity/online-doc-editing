/* eslint-disable no-undef */
'use strict'
const { createLogger, format, transports } = require('winston')
require('winston-daily-rotate-file')
const fs = require('fs')

const env = process.env.NODE_ENV || 'development'
const logDir = './logs'

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

// fs.access(logDir, err => {
//   console.log(err ? 'does not exist' : 'already exists!');
//   if (err) fs.mkdirSync(logDir);
// })

const dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: `${logDir}/io-api-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true, // writes to gzip archive
  maxSize: '200m' // use only integer for number bytes, or add suffix of k, m, or g for kilobytes, megabytes and gigabytes respectively
  // maxFiles: '14d' // use integer for number of log files to keep or add d as suffix for number of days
})

const Wlogger = createLogger({
  // change level if in dev environment versus production
  level: env === 'development' ? 'verbose' : 'info',
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(
      info => `${info.timestamp} ${info.level}: ${info.message}`
    )
  ),
  transports: [
    new transports.Console({
      level: 'info',
      format: format.combine(
        format.colorize(),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(
          info => `${info.timestamp} ${info.level}: ${info.message}`
        )
      )
    }),
    dailyRotateFileTransport
  ]
})

module.exports = Wlogger
