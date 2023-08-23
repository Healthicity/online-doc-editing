# #!/bin/bash

echo "Setting environment variables"


    # Data for sockets
    export PORT=3800
    export NODE_ENV=local

# Data for sockets
    export MONGODB_NAME=docapidb
    export LOCAL_MONGODB_URL=mongodb+srv://ferh97:BCsSsXO9L5uHg8Ss@cluster0.k01i9.mongodb.net/docapidb?retryWrites=true&w=majority
    export LOCAL_MONGODB_USER=ferh97
    export LOCAL_MONGODB_PASS=BCsSsXO9L5uHg8Ss
    export LOCAL_API_URL=http://localhost:3800

# S3 CREDENTIALS

    export S3_BUCKET=doc-api-bucket


    export ID=AKIAWKNI5U66RZJK6YPI
    export SECRET=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

# DocuSign API KEYS

    export USER_ID=49bb8af6-1f22-4104-906e-84cbb63658bd
    export API_ACCOUNT_ID=0e286e30-b458-406e-83f9-8fef3e497c5a
    export ACCOUNT_BASE_URI=https://demo.docusign.net
    export INTEGRATION_KEY=b03c311e-3375-4eb6-970e-6aebd4b056cb


    # # Data for sockets
    # export MONGODB_NAME=$/Doc-Project-API/MONGODB_NAME
    # export LOCAL_MONGODB_URL=$/Doc-Project-API/LOCAL_MONGODB_URL
    # export LOCAL_MONGODB_USER=$/Doc-Project-API/USER
    # export LOCAL_MONGODB_PASS=$/Doc-Project-API/LOCAL_MONGODB_PASS
    # export LOCAL_API_URL=$/Doc-Project-API/LOCAL_API_URL

    # # S3 CREDENTIALS
    # export S3_BUCKET=$/Doc-Project-API/S3_BUCKET

    # export ID=$/Doc-Project-API/ID
    # export SECRET=$/Doc-Project-API/SECRET

    # # DocuSign API KEYS
    # export USER_ID=$/Doc-Project-API/USER_ID
    # export API_ACCOUNT_ID=$/Doc-Project-API/API_ACCOUNT_ID
    # export ACCOUNT_BASE_URI=$/Doc-Project-API/ACCOUNT_BASE_URI
    # export INTEGRATION_KEY=$/Doc-Project-API/INTEGRATION_KEY

    # #env
    # export NODE_ENV=$/Doc-Project-API/NODE_ENV
    # export PORT=$/Doc-Project-API/PORT 


LOGS_DIR="/home/centos/Doc-Project-API/logs"

# Check if the logs directory exists
if [ -d "$LOGS_DIR" ]; then
  # Remove all log files in the directory
  rm -rf "$LOGS_DIR"
  echo "Deleted all log files in: $LOGS_DIR"
else
  echo "Logs directory does not exist: $LOGS_DIR"
fi