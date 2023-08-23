#!/bin/bash
set -e

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"


# Data for sockets
export PORT=$(aws ssm get-parameter --name /Doc-Project-API/PORT --query 'Parameter.Value' --output text)
export NODE_ENV=$(aws ssm get-parameter --name /Doc-Project-API/NODE_ENV --query 'Parameter.Value' --output text)

# Data for sockets
export MONGODB_NAME=$(aws ssm get-parameter --name /Doc-Project-API/MONGODB_NAME --query 'Parameter.Value' --output text)
export LOCAL_MONGODB_URL=$(aws ssm get-parameter --name /Doc-Project-API/LOCAL_MONGODB_URL --query 'Parameter.Value' --output text)
export LOCAL_MONGODB_USER=$(aws ssm get-parameter --name /Doc-Project-API/USER --query 'Parameter.Value' --output text)
export LOCAL_MONGODB_PASS=$(aws ssm get-parameter --name /Doc-Project-API/LOCAL_MONGODB_PASS --query 'Parameter.Value' --output text)
export LOCAL_API_URL=$(aws ssm get-parameter --name /Doc-Project-API/LOCAL_API_URL --query 'Parameter.Value' --output text)

# S3 CREDENTIALS
export S3_BUCKET=$(aws ssm get-parameter --name /Doc-Project-API/S3_BUCKET --query 'Parameter.Value' --output text)
export ID=$(aws ssm get-parameter --name /Doc-Project-API/ID --query 'Parameter.Value' --output text)
export SECRET=$(aws ssm get-parameter --name /Doc-Project-API/SECRET --query 'Parameter.Value' --output text)

# DocuSign API KEYS
export USER_ID=$(aws ssm get-parameter --name /Doc-Project-API/USER_ID --query 'Parameter.Value' --output text)
export API_ACCOUNT_ID=$(aws ssm get-parameter --name /Doc-Project-API/API_ACCOUNT_ID --query 'Parameter.Value' --output text)
export ACCOUNT_BASE_URI=$(aws ssm get-parameter --name /Doc-Project-API/ACCOUNT_BASE_URI --query 'Parameter.Value' --output text)
export INTEGRATION_KEY=$(aws ssm get-parameter --name /Doc-Project-API/INTEGRATION_KEY --query 'Parameter.Value' --output text)

# Verify Node.js and npm installation
printenv
node -v
npm -v

# Verify PM2 installation
pm2 -v

# Start the server using PM2
cd /home/centos/Doc-Project-API
pm2 start ./bin/server.js --name "Doc-Project-API" --log "$HOME/Doc-Project-API/startup.log" --error "$HOME/Doc-Project-API/startup-error.log" < /dev/null

# Save PM2 process list
pm2 save

echo "Server successfully started"