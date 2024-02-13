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

function ckEditorTokenGenerator() {
  const secretKey = process.env.CKE_ACCESS_KEY;

  if (!secretKey) {
    throw new Error('Missing environment variables for CKEditor Cloud Services.');
  }

  const token = jwt.sign({}, secretKey, { algorithm: 'HS256' });
  return token;
}

const ckeDocxToHtml = (data) => {
  const formData = new FormData();
  formData.append('file', data, 'document_file.docx');
  formData.append('config', JSON.stringify({default_styles: true}));

  return new Promise(function (resolve, reject) {
    axios.post(process.env.DOCX_TO_HTML_CONVERTER_URL, formData, { headers: { 'Authorization': ckEditorTokenGenerator() } })
      .then(response => {
        const htmlData = response.data.html;
        resolve(htmlData);
      })
      .catch(error => {
        console.log('Conversion error', error);
        reject(error);
      });
  });
};


module.exports = {
  decryptAccessToken,
  authorize,
  ckeDocxToHtml,
  ckEditorTokenGenerator
}
