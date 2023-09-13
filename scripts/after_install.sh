#!/bin/bash

echo "Setting environment variables"

# Retrieve and set the parameter values

# Data for sockets
export "PORT=$(aws ssm get-parameter --name /Doc-Project-API/PORT --query 'Parameter.Value' --output text)" > /home/centos/Doc-Project-API/.env
export "NODE_ENV=$(aws ssm get-parameter --name /Doc-Project-API/NODE_ENV --query 'Parameter.Value' --output text)" >> /home/centos/Doc-Project-API/.env

# MongoDB
export "MONGODB_NAME=$(aws ssm get-parameter --name /Doc-Project-API/MONGODB_NAME --query 'Parameter.Value' --output text)" >> /home/centos/Doc-Project-API/.env
export "LOCAL_MONGODB_URL=$(aws ssm get-parameter --name /Doc-Project-API/LOCAL_MONGODB_URL --query 'Parameter.Value' --output text)" >> /home/centos/Doc-Project-API/.env
export "LOCAL_MONGODB_USER=$(aws ssm get-parameter --name /Doc-Project-API/USER --query 'Parameter.Value' --output text)" >> /home/centos/Doc-Project-API/.env
export "LOCAL_MONGODB_PASS=$(aws ssm get-parameter --name /Doc-Project-API/LOCAL_MONGODB_PASS --query 'Parameter.Value' --output text)" >> /home/centos/Doc-Project-API/.env
export "LOCAL_API_URL=$(aws ssm get-parameter --name /Doc-Project-API/LOCAL_API_URL --query 'Parameter.Value' --output text)" >> /home/centos/Doc-Project-API/.env

# S3 CREDENTIALS
export "S3_BUCKET=$(aws ssm get-parameter --name /Doc-Project-API/S3_BUCKET --query 'Parameter.Value' --output text)" >> /home/centos/Doc-Project-API/.env
export "ID=$(aws ssm get-parameter --name /Doc-Project-API/ID --query 'Parameter.Value' --output text)" >> /home/centos/Doc-Project-API/.env
export "SECRET=$(aws ssm get-parameter --name /Doc-Project-API/SECRET --query 'Parameter.Value' --output text)" >> /home/centos/Doc-Project-API/.env

# DocuSign API KEYS
export "USER_ID=$(aws ssm get-parameter --name /Doc-Project-API/USER_ID --query 'Parameter.Value' --output text)" >> /home/centos/Doc-Project-API/.env
export "API_ACCOUNT_ID=$(aws ssm get-parameter --name /Doc-Project-API/API_ACCOUNT_ID --query 'Parameter.Value' --output text)" >> /home/centos/Doc-Project-API/.env
export "ACCOUNT_BASE_URI=$(aws ssm get-parameter --name /Doc-Project-API/ACCOUNT_BASE_URI --query 'Parameter.Value' --output text)" >> /home/centos/Doc-Project-API/.env
export "INTEGRATION_KEY=$(aws ssm get-parameter --name /Doc-Project-API/INTEGRATION_KEY --query 'Parameter.Value' --output text)" >> /home/centos/Doc-Project-API/.env

# New parameters
CORS_ORIGIN=$(aws ssm get-parameter --name /Doc-Project-API/CORS_ORIGIN --query 'Parameter.Value' --output text)
export "CORS_ORIGIN=\${CORS_ORIGIN//\./\\.}" >> /home/centos/Doc-Project-API/.env

export "JWT_SECRET=$(aws ssm get-parameter --name /Doc-Project-API/JWT_SECRET --query 'Parameter.Value' --output text)" >> /home/centos/Doc-Project-API/.env
export "PLATFORM_DB_NAME=$(aws ssm get-parameter --name /Doc-Project-API/PLATFORM_DB_NAME --query 'Parameter.Value' --output text)" >> /home/centos/Doc-Project-API/.env
export "PLATFORM_USERNAME=$(aws ssm get-parameter --name /Doc-Project-API/PLATFORM_USERNAME --query 'Parameter.Value' --output text)" >> /home/centos/Doc-Project-API/.env
export "PLATFORM_DB_HOST=$(aws ssm get-parameter --name /Doc-Project-API/PLATFORM_DB_HOST --query 'Parameter.Value' --output text)" >> /home/centos/Doc-Project-API/.env
export "PLATFORM_DB_DIALECT=$(aws ssm get-parameter --name /Doc-Project-API/PLATFORM_DB_DIALECT --query 'Parameter.Value' --output text)" >> /home/centos/Doc-Project-API/.env
export "PLATFORM_PASSWORD=$(aws ssm get-parameter --name /Doc-Project-API/PLATFORM_PASSWORD --query 'Parameter.Value' --output text)" >> /home/centos/Doc-Project-API/.env

printenv