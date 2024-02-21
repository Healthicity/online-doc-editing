const jwt = require('jsonwebtoken')
const axios = require( 'axios' );
const FormData = require( 'form-data' );
const { JSDOM } = require('jsdom');


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

function addListStyleType(html) {
    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    const document = dom.window.document;

    // Create a temporary element to parse the HTML string
    var tempElement = document.createElement('div');
    tempElement.innerHTML = html;

    // Get the root <ol> elements within the parsed HTML
    var rootOlElements = tempElement.querySelectorAll(':scope > ol');

    // Iterate over each root <ol> element
    rootOlElements.forEach(function (rootOlElement) {
        // Apply the provided list style type to the root <ol> element
        rootOlElement.style.listStyleType = 'decimal';
        // Recursively apply different list style types to nested <ol> elements
        applyOrderedListStyleTypeRecursively(rootOlElement, 1);
    });

    // Return the modified HTML string
    return tempElement.innerHTML;
}

 function applyOrderedListStyleTypeRecursively(olElement, level) {
    var listItems = olElement.children;
    var listStyleTypes = ['decimal', 'lower-alpha', 'lower-roman', 'upper-alpha', 'upper-roman'];
    var listStyleIndex = (level - 1) % listStyleTypes.length; // Calculate index based on the level
    var listStyleType = listStyleTypes[listStyleIndex];

    olElement.style.listStyleType = listStyleType; // Apply inline style for list-style-type

    for (var i = 0; i < listItems.length; i++) {
        var listItem = listItems[i];
        var nestedOl = listItem.querySelector('ol');
        if (nestedOl) {
            applyOrderedListStyleTypeRecursively(nestedOl, level + 1); // Recursively apply styles for nested lists
        }
    }
}

module.exports = {
  decryptAccessToken,
  authorize,
  ckeDocxToHtml,
  ckEditorTokenGenerator,
  addListStyleType,
  applyOrderedListStyleTypeRecursively,
}
