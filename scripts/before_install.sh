#!/bin/bash

LOGS_DIR="/home/centos/Doc-Project-API/logs"

# Check if the logs directory exists
if [ -d "$LOGS_DIR" ]; then
  # Remove all log files in the directory
  rm -rf "$LOGS_DIR"/*
  echo "Deleted all log files in: $LOGS_DIR"
else
  echo "Logs directory does not exist: $LOGS_DIR"
fi
