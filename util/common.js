const jwt = require('jsonwebtoken')
const axios = require( 'axios' );
const FormData = require( 'form-data' );

function decryptAccessToken (authorization_header) {
  const accessToken = authorization_header.split(' ')[1]
  return jwt.verify(accessToken, process.env.JWT_SECRET)
}

function authorize(req, draftDocumentId) {
  payload = decryptAccessToken(req.headers.authorization)
  const payloadExpired = payload.expires_in < Date.now() / 1000
  if (payload.document_draft_id !== draftDocumentId) {
    throw new Error('Unauthorized')
  }
}

function ckeConfig () {
  const token = jwt.sign( { aud: process.env.CKE_ENVIRONMENT_ID }, process.env.CKE_ACCESS_KEY , { algorithm: 'HS256' } );
  return { headers: { 'Authorization': token } };
}

const ckeDocxToHtml = (data) => {
  return new Promise(function (resolve, reject) {
    const formData = new FormData();
    formData.append( 'file', data, 'document_file.docx' );
    axios.post( 'https://docx-converter.cke-cs.com/v2/convert/docx-html', formData, ckeConfig )
      .then( response => {
        const htmlData = response.data.html;
        resolve(htmlData);
      } ).catch( error => {
        console.log( 'Conversion error', error );
        reject(error);
      } 
    );
  });
}


module.exports = {
  decryptAccessToken,
  authorize,
  ckeConfig,
  ckeDocxToHtml
}
