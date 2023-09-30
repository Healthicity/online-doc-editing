#!/bin/bash

# Set the AWS CLI region explicitly
aws configure set region us-west-2

# Define an array of parameter names without the prefix
PARAMETER_NAMES=(
  "NODE_ENV"
  "MONGODB_NAME"
  "LOCAL_MONGODB_URL"
  "LOCAL_MONGODB_USER"
  "LOCAL_MONGODB_PASS"
  "LOCAL_API_URL"
  "S3_BUCKET"
  "ID"
  "SECRET"
  "USER_ID"
  "API_ACCOUNT_ID"
  "ACCOUNT_BASE_URI"
  "INTEGRATION_KEY"
  "CORS_ORIGIN"
  "JWT_SECRET"
  "PLATFORM_DB_NAME"
  "PLATFORM_USERNAME"
  "PLATFORM_DB_HOST"
  "PLATFORM_DB_DIALECT"
  "PLATFORM_PASSWORD"
)

# Define the directory where .env should be created
ENV_DIRECTORY="/home/centos/Doc-Project-API"

# Create the directory if it doesn't exist
mkdir -p "$ENV_DIRECTORY"

# Define the log file
LOG_FILE="$ENV_DIRECTORY/deployment.log"

# Initialize the log file
> "$LOG_FILE"

# Function to log errors
log_error() {
  local timestamp
  timestamp=$(date +"%Y-%m-%d %T")
  echo "[$timestamp] ERROR: $1" >> "$LOG_FILE"
}

# Function to log messages
log_message() {
  local timestamp
  timestamp=$(date +"%Y-%m-%d %T")
  echo "[$timestamp] INFO: $1" >> "$LOG_FILE"
}

# Retrieve and set the environment variables from AWS SSM
for PARAMETER_NAME in "${PARAMETER_NAMES[@]}"; do
  FULL_PARAMETER_NAME="/Doc-Project-API/$PARAMETER_NAME"
  PARAMETER_VALUE=$(aws ssm get-parameter --name "$FULL_PARAMETER_NAME" --query "Parameter.Value" --output text 2>/dev/null)
  
  if [ -n "$PARAMETER_VALUE" ]; then
    echo "$PARAMETER_NAME=$PARAMETER_VALUE" >> "$ENV_DIRECTORY/.env"
    log_message "Retrieved $FULL_PARAMETER_NAME"
  else
    log_error "$FULL_PARAMETER_NAME not found or empty."
  fi
done

if [ -s "$LOG_FILE" ]; then
  echo "Error occurred. Check $LOG_FILE for details."
else
  echo ".env file created successfully in $ENV_DIRECTORY."
fi
