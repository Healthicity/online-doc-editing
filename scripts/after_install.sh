#!/bin/bash

echo "Setting environment variables"

touch .env

# Data for sockets
echo PORT=$(aws ssm get-parameter --name /Doc-Project-API/PORT --query 'Parameter.Value' --output text) >> /home/centos/Doc-Project-API/.env
echo NODE_ENV=$(aws ssm get-parameter --name /Doc-Project-API/NODE_ENV --query 'Parameter.Value' --output text) >> /home/centos/Doc-Project-API/.env

# Data for sockets
echo MONGODB_NAME=$(aws ssm get-parameter --name /Doc-Project-API/MONGODB_NAME --query 'Parameter.Value' --output text) >> /home/centos/Doc-Project-API/.env
echo LOCAL_MONGODB_URL=$(aws ssm get-parameter --name /Doc-Project-API/LOCAL_MONGODB_URL --query 'Parameter.Value' --output text) >> /home/centos/Doc-Project-API/.env
echo LOCAL_MONGODB_USER=$(aws ssm get-parameter --name /Doc-Project-API/USER --query 'Parameter.Value' --output text) >> /home/centos/Doc-Project-API/.env
echo LOCAL_MONGODB_PASS=$(aws ssm get-parameter --name /Doc-Project-API/LOCAL_MONGODB_PASS --query 'Parameter.Value' --output text) >> /home/centos/Doc-Project-API/.env
echo LOCAL_API_URL=$(aws ssm get-parameter --name /Doc-Project-API/LOCAL_API_URL --query 'Parameter.Value' --output text) >> /home/centos/Doc-Project-API/.env

# S3 CREDENTIALS
echo S3_BUCKET=$(aws ssm get-parameter --name /Doc-Project-API/S3_BUCKET --query 'Parameter.Value' --output  text) >> /home/centos/Doc-Project-API/.env
echo ID=$(aws ssm get-parameter --name /Doc-Project-API/ID --query 'Parameter.Value' --output text) >> /home/centos/Doc-Project-API/.env
echo SECRET=$(aws ssm get-parameter --name /Doc-Project-API/SECRET --query 'Parameter.Value' --output text) >> /home/centos/Doc-Project-API/.env

# DocuSign API KEYS
echo USER_ID=$(aws ssm get-parameter --name /Doc-Project-API/USER_ID --query 'Parameter.Value' --output text) >> /home/centos/Doc-Project-API/.env
echo API_ACCOUNT_ID=$(aws ssm get-parameter --name /Doc-Project-API/API_ACCOUNT_ID --query 'Parameter.Value' --output text) >> /home/centos/Doc-Project-API/.env
echo ACCOUNT_BASE_URI=$(aws ssm get-parameter --name /Doc-Project-API/ACCOUNT_BASE_URI --query 'Parameter.Value' --output text)>> /home/centos/Doc-Project-API/.env
echo INTEGRATION_KEY=$(aws ssm get-parameter --name /Doc-Project-API/INTEGRATION_KEY --query 'Parameter.Value' --output text)>> /home/centos/Doc-Project-API/.env


