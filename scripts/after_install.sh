#!/bin/bash

echo "Setting environment variables"

# Retrieve and set the parameter values

# Data for sockets
aws ssm get-parameter --name /Doc-Project-API/PORT --query 'Parameter.Value' --output text > /home/centos/Doc-Project-API/.env
aws ssm get-parameter --name /Doc-Project-API/NODE_ENV --query 'Parameter.Value' --output text >> /home/centos/Doc-Project-API/.env

# MongoDB
aws ssm get-parameter --name /Doc-Project-API/MONGODB_NAME --query 'Parameter.Value' --output text >> /home/centos/Doc-Project-API/.env
aws ssm get-parameter --name /Doc-Project-API/LOCAL_MONGODB_URL --query 'Parameter.Value' --output text >> /home/centos/Doc-Project-API/.env
aws ssm get-parameter --name /Doc-Project-API/USER --query 'Parameter.Value' --output text >> /home/centos/Doc-Project-API/.env
aws ssm get-parameter --name /Doc-Project-API/LOCAL_MONGODB_PASS --query 'Parameter.Value' --output text >> /home/centos/Doc-Project-API/.env
aws ssm get-parameter --name /Doc-Project-API/LOCAL_API_URL --query 'Parameter.Value' --output text >> /home/centos/Doc-Project-API/.env

# S3 CREDENTIALS
aws ssm get-parameter --name /Doc-Project-API/S3_BUCKET --query 'Parameter.Value' --output text >> /home/centos/Doc-Project-API/.env
aws ssm get-parameter --name /Doc-Project-API/ID --query 'Parameter.Value' --output text >> /home/centos/Doc-Project-API/.env
aws ssm get-parameter --name /Doc-Project-API/SECRET --query 'Parameter.Value' --output text >> /home/centos/Doc-Project-API/.env

# DocuSign API KEYS
aws ssm get-parameter --name /Doc-Project-API/USER_ID --query 'Parameter.Value' --output text >> /home/centos/Doc-Project-API/.env
aws ssm get-parameter --name /Doc-Project-API/API_ACCOUNT_ID --query 'Parameter.Value' --output text >> /home/centos/Doc-Project-API/.env
aws ssm get-parameter --name /Doc-Project-API/ACCOUNT_BASE_URI --query 'Parameter.Value' --output text >> /home/centos/Doc-Project-API/.env
aws ssm get-parameter --name /Doc-Project-API/INTEGRATION_KEY --query 'Parameter.Value' --output text >> /home/centos/Doc-Project-API/.env

# New parameters
CORS_ORIGIN=$(aws ssm get-parameter --name /Doc-Project-API/CORS_ORIGIN --query 'Parameter.Value' --output text)
echo "CORS_ORIGIN='${CORS_ORIGIN//\./\\.}'" >> /home/centos/Doc-Project-API/.env

aws ssm get-parameter --name /Doc-Project-API/JWT_SECRET --query 'Parameter.Value' --output text >> /home/centos/Doc-Project-API/.env
aws ssm get-parameter --name /Doc-Project-API/PLATFORM_DB_NAME --query 'Parameter.Value' --output text >> /home/centos/Doc-Project-API/.env
aws ssm get-parameter --name /Doc-Project-API/PLATFORM_USERNAME --query 'Parameter.Value' --output text >> /home/centos/Doc-Project-API/.env
aws ssm get-parameter --name /Doc-Project-API/PLATFORM_DB_HOST --query 'Parameter.Value' --output text >> /home/centos/Doc-Project-API/.env
aws ssm get-parameter --name /Doc-Project-API/PLATFORM_DB_DIALECT --query 'Parameter.Value' --output text >> /home/centos/Doc-Project-API/.env
aws ssm get-parameter --name /Doc-Project-API/PLATFORM_PASSWORD --query 'Parameter.Value' --output text >> /home/centos/Doc-Project-API/.env
