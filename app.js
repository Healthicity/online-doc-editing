'use strict'
/* eslint-disable no-undef */
const express = require('express')
const app = express()
const logger = require('morgan')
const cors = require('cors')
const Wlogger = require('./config/winston')
require('dotenv').config()
// const path = require('path')

// Initialize middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logger('dev'))
// Init console log environment
const environment = process.env.NODE_ENV
Wlogger.info('IO API initiated; starting ' + environment + ' environment...')

// Import all schema routes
const apiDocumentsRoutes = require('./routes/api_documents.route')

// Set prefix api endpoints for all routes
// app.get('/client', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')))
// Test API
app.get('/health', (req, res) => res.sendStatus(200))

// API routes -------------------------
app.use('/api_documents', apiDocumentsRoutes)

// API ERROR HANDLERS --------------------
// Catch resources or method calls error handler
function resourceErrorHandler (req, res, next) {
  Wlogger.info('resource error handler')
  const error = new Error(`The specified resource or page was not found: ${req.path}`)
  error.status = 404
  error.errorName = 'Not Found'
  error.friendlyMessage = 'An error occured, please check again!'
  error.apiMessage = error.message
  console.log(error)
  next(error)
}

// Catch client errors and forward to server error handler
function clientErrorHandler (err, req, res, next) {
  Wlogger.error(`Error Handler Middleware, Path: ${req.path}, Error: ${err.errorName}`)
  // Check if status if 404 or undefined
  // console.log(err.status)
  if (err.status === 404) {
    return res.status(err.status).send({
      status: err.status,
      errorAPIResponse: `${err.apiMessage}, endpoint: ${req.path}`,
      friendlyMessage: err.friendlyMessage,
      errorName: err.errorName
    })
  } else if (err.status === undefined) {
    err.status = 400
    return res.status(err.status).send({
      status: err.status,
      errorAPIResponse: `${err.apiMessage}, endpoint: ${req.path}`,
      friendlyMessage: err.friendlyMessage,
      errorName: err.errorName
    })
  } else if (err.status === 422) {
    return res.status(err.status).send({
      status: err.status,
      errorAPIResponse: `${err.apiMessage}, endpoint: ${req.path}`,
      friendlyMessage: err.friendlyMessage,
      errorName: err.errorName
    })
  } else {
    next(err)
  }
}

// Server error handler
function errorHandler (err, req, res, next) {
  err.status = err.status || 500
  if (environment === 'development') {
    return res
      .status(err.status)
      .send({
        status: err.status,
        errorAPIResponse: `${err.apiMessage}, endpoint: ${req.path}`,
        friendlyMessage: err.friendlyMessage,
        errorName: err.errorName
      })
  } else if (environment === 'production') {
    return res
      .status(err.status)
      .send({ status: err.status, errorAPIResponse: err.message })
  }
}

// Use error handlers
app.use(resourceErrorHandler)
app.use(clientErrorHandler)
app.use(errorHandler)

module.exports = app
