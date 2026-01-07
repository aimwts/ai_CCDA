import asyncio
import json
import serial
import serial.tools.list_ports
import websockets
import os
import time

# -----------------------------
# CONFIG
# -----------------------------
BACKEND_WS_URL = os.getenv("BACKEND_WS_URL", "ws://backend:4000/arduino")
WS_TOKEN = os.getenv("WS_TOKEN", "my-secret-token")
SERIAL_BAUD = 9600
RECONNECT_DELAY = 3


# -----------------------------
# Find Arduino Serial Port
# -----------------------------
def find_arduino_port():
    ports = serial.tools.list_ports.comports()
    for p in ports:
        if "Arduino" in p.description or "ttyACM" in p.device or "ttyUSB" in p.device:
            print(f"🔌 Arduino detected on {p.device}")
            return p.device
    print("⚠️ No Arduino detected.")
    return None


# -----------------------------
# Read from Arduino Serial
# -----------------------------
def read_serial_line(ser):
    try:
        line = ser.readline().decode("utf-8").strip()
        if line:
            print(f"📥 Serial: {line}")
        return line
    except Exception as e:
        print(f"❌ Serial read error: {e}")
        return None


# -----------------------------
# Parse Arduino JSON packets
# -----------------------------
def parse_packet(line):
    try:
        data = json.loads(line)
        if isinstance(data, dict):
            return data
    except json.JSONDecodeError:
        print(f"⚠️ Invalid JSON from Arduino: {line}")
    return None


# -----------------------------
# WebSocket Sender
# -----------------------------
async def send_to_backend(ws, payload):
    try:
        await ws.send(json.dumps(payload))
        print(f"📤 Sent to backend: {payload}")
    except Exception as e:
        print(f"❌ WS send error: {e}")


# -----------------------------
# Main Loop
# -----------------------------
async def bridge_loop():
    while True:
        port = find_arduino_port()
        if not port:
            print("⏳ Retrying Arduino detection...")
            time.sleep(RECONNECT_DELAY)
            continue

        try:
            ser = serial.Serial(port, SERIAL_BAUD, timeout=1)
            print("🔗 Serial connection established.")
        except Exception as e:
            print