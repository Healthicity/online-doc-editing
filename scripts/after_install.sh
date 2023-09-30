#!/bin/bash

# Set the AWS CLI region explicitly
aws configure set region us-west-2

# Retrieve the environment variables from AWS SSM
echo "Retrieving environment variables from AWS SSM..."

NODE_ENV=$(aws ssm get-parameter --name "/Doc-Project-API/NODE_ENV" --query "Parameter.Value" --output text)
MONGODB_NAME=$(aws ssm get-parameter --name "/Doc-Project-API/MONGODB_NAME" --query "Parameter.Value" --output text)
LOCAL_MONGODB_URL=$(aws ssm get-parameter --name "/Doc-Project-API/LOCAL_MONGODB_URL" --query "Parameter.Value" --output text)
LOCAL_MONGODB_USER=$(aws ssm get-parameter --name "/Doc-Project-API/LOCAL_MONGODB_USER" --query "Parameter.Value" --output text)
LOCAL_MONGODB_PASS=$(aws ssm get-parameter --name "/Doc-Project-API/LOCAL_MONGODB_PASS" --query "Parameter.Value" --output text)
LOCAL_API_URL=$(aws ssm get-parameter --name "/Doc-Project-API/LOCAL_API_URL" --query "Parameter.Value" --output text)
S3_BUCKET=$(aws ssm get-parameter --name "/Doc-Project-API/S3_BUCKET" --query "Parameter.Value" --output text)
ID=$(aws ssm get-parameter --name "/Doc-Project-API/ID" --query "Parameter.Value" --output text)
SECRET=$(aws ssm get-parameter --name "/Doc-Project-API/SECRET" --query "Parameter.Value" --output text)
USER_ID=$(aws ssm get-parameter --name "/Doc-Project-API/USER_ID" --query "Parameter.Value" --output text)
API_ACCOUNT_ID=$(aws ssm get-parameter --name "/Doc-Project-API/API_ACCOUNT_ID" --query "Parameter.Value" --output text)
ACCOUNT_BASE_URI=$(aws ssm get-parameter --name "/Doc-Project-API/ACCOUNT_BASE_URI" --query "Parameter.Value" --output text)
INTEGRATION_KEY=$(aws ssm get-parameter --name "/Doc-Project-API/INTEGRATION_KEY" --query "Parameter.Value" --output text)
CORS_ORIGIN=$(aws ssm get-parameter --name "/Doc-Project-API/CORS_ORIGIN" --query "Parameter.Value" --output text)
JWT_SECRET=$(aws ssm get-parameter --name "/Doc-Project-API/JWT_SECRET" --query "Parameter.Value" --output text)
PLATFORM_DB_NAME=$(aws ssm get-parameter --name "/Doc-Project-API/PLATFORM_DB_NAME" --query "Parameter.Value" --output text)
PLATFORM_USERNAME=$(aws ssm get-parameter --name "/Doc-Project-API/PLATFORM_USERNAME" --query "Parameter.Value" --output text)
PLATFORM_DB_HOST=$(aws ssm get-parameter --name "/Doc-Project-API/PLATFORM_DB_HOST" --query "Parameter.Value" --output text)
PLATFORM_DB_DIALECT=$(aws ssm get-parameter --name "/Doc-Project-API/PLATFORM_DB_DIALECT" --query "Parameter.Value" --output text)
PLATFORM_PASSWORD=$(aws ssm get-parameter --name "/Doc-Project-API/PLATFORM_PASSWORD" --query "Parameter.Value" --output text)

# Store the environment variables in a .env file
echo "Creating .env file..."

cat <<EOF > .env
NODE_ENV=${NODE_ENV}
MONGODB_NAME=${MONGODB_NAME}
LOCAL_MONGODB_URL=${LOCAL_MONGODB_URL}
LOCAL_MONGODB_USER=${LOCAL_MONGODB_USER}
LOCAL_MONGODB_PASS=${LOCAL_MONGODB_PASS}
LOCAL_API_URL=${LOCAL_API_URL}
S3_BUCKET=${S3_BUCKET}
ID=${ID}
SECRET=${SECRET}
USER_ID=${USER_ID}
API_ACCOUNT_ID=${API_ACCOUNT_ID}
ACCOUNT_BASE_URI=${ACCOUNT_BASE_URI}
INTEGRATION_KEY=${INTEGRATION_KEY}
CORS_ORIGIN=${CORS_ORIGIN}
JWT_SECRET=${JWT_SECRET}
PLATFORM_DB_NAME=${PLATFORM_DB_NAME}
PLATFORM_USERNAME=${PLATFORM_USERNAME}
PLATFORM_DB_HOST=${PLATFORM_DB_HOST}
PLATFORM_DB_DIALECT=${PLATFORM_DB_DIALECT}
PLATFORM_PASSWORD=${PLATFORM_PASSWORD}
EOF

echo ".env file created successfully."
