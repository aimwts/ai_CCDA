#!/bin/bash

# Find the PID of the process running on port 4000
PID=$(lsof -t -i:4000)

if [ -n "$PID" ]; then
  echo "Stopping backend (PID: $PID)..."
  kill "$PID"
  sleep 1
else
  echo "No backend running on port 4000."
fi

echo "Starting backend..."
npm run dev
