# #!/bin/bash


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