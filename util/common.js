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

function ckeConfig() {
  const audience = process.env.CKE_ENVIRONMENT_ID;
  const secretKey = process.env.CKE_ACCESS_KEY;

  if (!audience || !secretKey) {
    throw new Error('Missing environment variables for CKEditor Cloud Services.');
  }

  const token = jwt.sign({ aud: audience }, secretKey, { algorithm: 'HS256' });
  return { headers: { 'Authorization': token } };
}

const ckeDocxToHtml = (data) => {
  const formData = new FormData();
  formData.append('file', data, 'document_file.docx');
  formData.append('config', JSON.stringify({default_styles: true}));

  return new Promise(function (resolve, reject) {
    axios.post('https://docx-converter.cke-cs.com/v2/convert/docx-html', formData, ckeConfig())
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

const replaceUnsupportedHtmlTags = (data) => {
  let res = data.replace(/<s>/g, '<span style="inline-block;text-decoration: line-through">');
  res = res.replace(/<\/s>/g, "</span>");
  res = res.replace(/<mark class="marker-green">/g, '<span style="background-color: hsl(120, 93%, 68%)">');
  res = res.replace(/<mark class="marker-yellow">/g, '<span style="background-color: hsl(60, 97%, 73%)">');
  res = res.replace(/<mark class="marker-pink">/g, '<span style="background-color: hsl(345, 96%, 73%)">');
  res = res.replace(/<mark class="marker-blue">/g, '<span style="background-color: hsl(201, 97%, 72%)">');
  res = res.replace(/<mark class="pen-red">/g, '<span style="background-color: hsl(0, 85%, 49%)">');
  res = res.replace(/<mark class="pen-green">/g, '<span style="background-color: hsl(112, 100%, 27%)">');
  res = res.replace(/<\/mark>/g, "</span>");
  return res;
}


module.exports = {
  decryptAccessToken,
  authorize,
  ckeDocxToHtml,
  replaceUnsupportedHtmlTags
}
