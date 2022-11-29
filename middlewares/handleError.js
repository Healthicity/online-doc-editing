'use strict'

module.exports = (status, friendlyMessage, apiMessage, errorName) => {
  console.log('handling error...')

  // In case apiMessage and errorName were not provided
  if (!apiMessage && !errorName) {
    if (status === 400) {
      [apiMessage, errorName] = badRequestError()
      return { status, friendlyMessage, apiMessage, errorName }
    } else if (status === 404) {
      [apiMessage, errorName] = notFound()
      return { status, friendlyMessage, apiMessage, errorName }
    } else if (status === 422) {
      [apiMessage, errorName] = validationError()
      return { status, friendlyMessage, apiMessage, errorName }
    } else if (status === 500) {
      [apiMessage, errorName] = internalServerError()
      return { status, friendlyMessage, apiMessage, errorName }
    }

    // Default error responses in case no status code matched
    [apiMessage, errorName] = ['Error occurred in API, please check it.', 'API Error']
    return { status, friendlyMessage, apiMessage, errorName }
  }

  // Return response when all arguments were provided by the user
  return { status, friendlyMessage, apiMessage, errorName }
}

function badRequestError () {
  return ['Something bad occurs in the request!', 'Bad Request']
}

function notFound () {
  const [apiMessage, errorName] = ['Data was not found!', 'Not Found']

  return [apiMessage, errorName]
}

function validationError () {
  const [apiMessage, errorName] = ['Validation error was found!', 'Unprocessable Entity']

  return [apiMessage, errorName]
}

function internalServerError () {
  const [apiMessage, errorName] = ['Internal server error was found!', 'Internal Server Error']

  return [apiMessage, errorName]
}
