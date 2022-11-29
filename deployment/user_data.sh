#!/bin/bash
id=$(curl http://169.254.169.254/latest/meta-data/instance-id)
env_value=$(aws ec2 describe-tags --filters "Name=resource-id,Values=$id" "Name=key,Values=env" --region=us-east-1 | jq -r .[][].Value)
export env=$env_value
echo $env
cd /home/ubuntu/io_api
npm start
