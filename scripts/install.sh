#!/bin/bash

cd /home/centos

# Update the system
sudo yum update -y

# Install curl if not installed
sudo yum install curl -y

# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Set up NVM environment
echo 'export NVM_DIR="$HOME/.nvm"' >> "$HOME/.bashrc"
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm' >> "$HOME/.bashrc"

# Install Node.js and set the default version
nvm install 16
nvm alias default 16

# Verify Node.js and npm installation
node -v
npm -v

# Clear npm cache
sudo npm cache clean --force

# Install PM2 globally
sudo npm install -g pm2

# Verify PM2 installation
pm2 -v

# Make PM2 accessible globally by adding its bin to /usr/local/bin
sudo ln -s $NVM_DIR/versions/node/$(node -v | cut -c 2-)/bin/pm2 /usr/local/bin/pm2

# Adding PM2 system startup script
sudo env PATH=$PATH:/usr/local/bin pm2 startup systemd -u centos --hp /home/centos