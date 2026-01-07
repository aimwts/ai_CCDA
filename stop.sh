#!/bin/bash

echo "🛑 Stopping AI CC/DA Monitoring System..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker is not running. Nothing to stop."
  exit 0
fi

echo "📦 Stopping all Docker services..."
docker-compose down

echo "🧹 Cleaning up unused containers and networks..."
docker system prune -f > /dev/null

echo "🟢 All services stopped successfully."
