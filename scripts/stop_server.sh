#!/bin/bash
echo "Stopping all PM2 managed applications..."
pm2 stop all
pm2 delete all
if [ $? -eq 0 ]
then
  echo "Successfully stopped all PM2 managed applications."
else
  echo "Failed to stop all PM2 managed applications, trying to forcefully kill node processes..."
  pkill -9 node
  if [ $? -eq 0 ]
  then
    echo "Successfully killed node processes."
  else
    echo "Failed to kill node processes. Manual intervention might be required."
  fi
fi