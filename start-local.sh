#!/bin/bash

echo "🚀 Starting AI CC/DA (Local Mode)..."

# Start backend
echo "📡 Starting backend..."
cd backend
npm install
npm run dev &
BACKEND_PID=$!
cd ..

# Start frontend
echo "🌐 Starting frontend..."
cd frontend
npm install
npm run dev &
FRONTEND_PID=$!
cd ..

# Start Python services
echo "🐍 Starting Python hardware services..."

cd hardware/envSensorService
python3 main.py &
ENV_PID=$!
cd ../..

cd hardware/senseHatService
python3 main.py &
SENSE_PID=$!
cd ../..

cd hardware/arduinoBridge
python3 main.py &
ARDUINO_PID=$!
cd ../..

cd hardware/imuService
python3 main.py &
IMU_PID=$!
cd ../..

cd hardware/ledMatrixService
python3 main.py &
LED_PID=$!
cd ../..

echo "🟢 All services started!"
echo "🌐 Frontend: http://localhost:5173"
echo "📡 Backend API: http://localhost:3000"
echo "📡 WebSocket: ws://localhost:4000"

# Keep script running
wait
