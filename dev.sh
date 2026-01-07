#!/bin/bash

echo "🛠️ Starting AI CC/DA in DEV mode..."

echo "📡 Starting backend..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

echo "🌐 Starting frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "🟢 Dev mode running."
echo "Frontend: http://localhost:5173"
echo "Backend: http://localhost:3000"

wait
