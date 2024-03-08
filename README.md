# Document Editing in CM (Backend)

## Setup instructions for Mac

Prerequisite - Install [brew](https://brew.sh/)

Here `n` is used to install the node version. If you are using other version managers like `nvm` follow the instructions for that version manager to install required node version to avoid any conflicts.

```
brew install n
sudo n 16.20
brew tap mongodb/brew
brew update
brew install mongodb-community@7.0
brew services start mongodb/brew/mongodb-community
cp .env.development .env  (Make the required changes in env variables like s3 credentials)
npm install
NODE_ENV=development npm start
```
Follow the steps in this [link](https://github.com/Healthicity/compliance-manager/blob/master/docs/local_development_setup.md) to setup platform database

# AWS Deployment Guide

Please read the how-to-deploy.md file for instructions on how to deploy InAppDoc to AWS.
https://github.com/Healthicity/online-doc-editing/blob/CM-8563-upload-latest/Aws-Deployment-guide.md
