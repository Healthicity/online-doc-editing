#!/bin/bash
set -e

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"


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