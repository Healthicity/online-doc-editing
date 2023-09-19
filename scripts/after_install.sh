# Define an array of parameter names
params=(
    NODE_ENV
    MONGODB_NAME
    LOCAL_MONGODB_URL
    LOCAL_MONGODB_USER
    LOCAL_MONGODB_PASS
    LOCAL_API_URL
    S3_BUCKET
    ID
    SECRET
    USER_ID
    API_ACCOUNT_ID
    ACCOUNT_BASE_URI
    INTEGRATION_KEY
    CORS_ORIGIN
    JWT_SECRET
    PLATFORM_DB_NAME
    PLATFORM_USERNAME
    PLATFORM_DB_HOST
    PLATFORM_DB_DIALECT
    PLATFORM_PASSWORD
)

# Loop through the parameters and fetch and set each one
for param in "${params[@]}"; do
    value=$(aws ssm get-parameter --name "/Doc-Project-API/$param" --query 'Parameter.Value' --output text)
    if [ -n "$value" ]; then
        echo "$param=$value" >> /home/centos/Doc-Project-API/.env
    fi
done