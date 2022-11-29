const axios = require('axios')
class Envelope {
  static async allEnvelopes (req, res, next) {
    const { params } = req
    console.log(params)
    try {
      const data = await axios.get(`/restapi/v2.1/accounts/${params.accountId}/envelopes/${params.envelopeId}`)
      console.log(data)
      if (!data) return res.status(404).send({ message: 'No envelopes found!' })

      return res.status(200).send(data)
    } catch (error) {
      return next({
        status: 500,
        message: `An error occured: ${error.message}`,
        error: error.message
      })
    }
  }

  // Create and send an envelope, you are able to:
  // Create and send an envelope with documents, recipients, and tabs.
  // Create and send an envelope from a template.
  // Create and send an envelope from a combination of documents and templates.
  // Create a draft envelope.
  static async newEnvelope (req, res, next) {
    const { status, emailSubject, recipients, documents } = req.body

    try {
      const data = axios.post('/restapi/v2.1/accounts/{accountId}/envelopes', {
        status, emailSubject, documents, recipients
      })

      if (!data) return res.status(404).send({ message: 'No envelopes found!' })

      return res.status(201).send({ message: 'Envelope created successfully!', data: data })
    } catch (error) {
      return next({
        status: 500,
        message: `An error occured: ${error.message}`,
        error: error.message
      })
    }
  }
}

module.exports = Envelope
