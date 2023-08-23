#!/bin/bash
set -e

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"





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
# Verify Node.js and npm installation
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