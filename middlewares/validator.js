'use strict'
/* eslint-disable no-prototype-builtins */
//* middlewares/Validator.js
//* Include joi to check error type
//* Include all validators
const Validators = require('./validations')
const handleError = require('./handleError')

module.exports = function (validator) {
  //! If validator is not exist, throw err
  if (!Validators.hasOwnProperty(validator)) { throw new Error(`'${validator}' validator does not exist`) }

  return async function (req, res, next) {
    try {
      const objToValid = { ...req.body, ...req.query, ...req.params }
      // console.log(objToValid)
      await Validators[validator].validateAsync(objToValid)
      // req.body = validated
      next()
    } catch (err) {
      //* Pass err to next
      const { statusCode, message, name } = err
      // console.log('Joi error ', err)
      //! If validation error occurs call next with HTTP 422. Otherwise HTTP 500
      if (err.isJoi) {
        // Return an error
        return next(handleError(422, 'Ups, a request validation error occurs!', message, name))
      }
      return next(handleError(statusCode, 'A server error occured!', message, name))
    }
  }
}
