#!/bin/bash

echo "🚀 Starting AI CC/DA Monitoring System..."

# Ensure Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker is not running. Please start Docker Desktop."
  exit 1
fi

echo "📦 Building and starting all services..."
docker-compose up --build -d

echo "⏳ Waiting for backend to become available..."
until curl -s http://localhost:3000/health > /dev/null; do
  sleep 1
done

echo "🟢 Backend is up!"

echo "🌐 Frontend running at: http://localhost:5173"
echo "🔌 Backend API running at: http://localhost:3000"
echo "📡 WebSocket server running at: ws://localhost:4000"
echo "🐘 PostgreSQL running at: localhost:5432"

echo "🎉 All services started successfully!"
