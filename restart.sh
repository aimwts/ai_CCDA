#!/bin/bash

echo "🔄 Restarting AI CC/DA Monitoring System..."

./stop.sh
./start.sh

echo "🟢 Restart complete."
