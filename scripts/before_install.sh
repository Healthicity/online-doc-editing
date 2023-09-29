#!/bin/bash

# Define log and directory paths
LOGS_DIR="/home/centos/Doc-Project-API/logs"
LOG_FILE="/home/centos/Doc-Project-API/deletion.log"

# Function to log messages with timestamps
log() {
  local message="$1"
  local timestamp="$(date +'%Y-%m-%d %H:%M:%S')"
  echo "$timestamp - $message" >> "$LOG_FILE"
}

# Function to delete log files
delete_log_files() {
  local deleted_files=("$LOGS_DIR"/*)
  rm -rf "$LOGS_DIR"/*
  return $?
}

# Check if the logs directory exists
if [ -d "$LOGS_DIR" ]; then
  delete_log_files
  if [ $? -eq 0 ]; then
    log "Deleted ${#deleted_files[@]} log files in: $LOGS_DIR"
  else
    log "Failed to delete log files in: $LOGS_DIR"
  fi
else
  log "Logs directory does not exist: $LOGS_DIR"
fi
