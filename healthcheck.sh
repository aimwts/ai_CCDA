#!/bin/bash

echo "🩺 Running system health check..."

check() {
  if curl -s $1 > /dev/null; then
    echo "🟢 $2 OK"
  else
    echo "❌ $2 FAILED"
  fi
}

check http://localhost:3000/health "Backend API"
check http://localhost:5173 "Frontend"
check http://localhost:3000/history/test "Database (via backend)"
check http://localhost:4000 "WebSocket Server"

echo "🏁 Health check complete."
