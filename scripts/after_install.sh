#!/bin/bash

# Set the AWS CLI region explicitly
aws configure set region us-west-2

# Define an array of parameter names
PARAMETER_NAMES=(
  "/Doc-Project-API/NODE_ENV"
  "/Doc-Project-API/MONGODB_NAME"
  "/Doc-Project-API/LOCAL_MONGODB_URL"
  "/Doc-Project-API/LOCAL_MONGODB_USER"
  "/Doc-Project-API/LOCAL_MONGODB_PASS"
  "/Doc-Project-API/LOCAL_API_URL"
  "/Doc-Project-API/S3_BUCKET"
  "/Doc-Project-API/ID"
  "/Doc-Project-API/SECRET"
  "/Doc-Project-API/USER_ID"
  "/Doc-Project-API/API_ACCOUNT_ID"
  "/Doc-Project-API/ACCOUNT_BASE_URI"
  "/Doc-Project-API/INTEGRATION_KEY"
  "/Doc-Project-API/CORS_ORIGIN"
  "/Doc-Project-API/JWT_SECRET"
  "/Doc-Project-API/PLATFORM_DB_NAME"
  "/Doc-Project-API/PLATFORM_USERNAME"
  "/Doc-Project-API/PLATFORM_DB_HOST"
  "/Doc-Project-API/PLATFORM_DB_DIALECT"
  "/Doc-Project-API/PLATFORM_PASSWORD"
)

# Create or truncate the .env file
> .env

# Retrieve and set the environment variables from AWS SSM
for PARAMETER_NAME in "${PARAMETER_NAMES[@]}"; do
  PARAMETER_VALUE=$(aws ssm get-parameter --name "$PARAMETER_NAME" --query "Parameter.Value" --output text 2>/dev/null)
  
  if [ -n "$PARAMETER_VALUE" ]; then
    echo "$PARAMETER_NAME=$PARAMETER_VALUE" >> .env
    echo "Retrieved $PARAMETER_NAME"
  else
    echo "Warning: $PARAMETER_NAME not found or empty."
  fi
done

echo ".env file created successfully."
