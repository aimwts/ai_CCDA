import asyncio
import json
import os
import time
import websockets
import Adafruit_DHT
from smbus2 import SMBus
import serial

# -----------------------------
# CONFIG
# -----------------------------
BACKEND_WS_URL = os.getenv("BACKEND_WS_URL", "ws://backend:4000/plant")
WS_TOKEN = os.getenv("WS_TOKEN", "my-secret-token")

DHT_PIN = int(os.getenv("DHT_PIN", "4"))  # GPIO pin for DHT22
BH1750_ADDR = 0x23                        # Light sensor I2C address
SERIAL_PORT = os.getenv("SOIL_SERIAL", "/dev/ttyUSB0")
SERIAL_BAUD = 9600

RECONNECT_DELAY = 3


# -----------------------------
# Read DHT22 (Temp + Humidity)
# -----------------------------
def read_dht22():
    humidity, temperature = Adafruit_DHT.read_retry(Adafruit_DHT.DHT22, DHT_PIN)
    return {
        "temperature": round(temperature, 2) if temperature else None,
        "humidity": round(humidity, 2) if humidity else None
    }


# -----------------------------
# Read BH1750 Light Sensor
# -----------------------------
def read_bh1750():
    try:
        bus = SMBus(1)
        data = bus.read_i2c_block_data(BH1750_ADDR, 0x20)
        raw = (data[0] << 8) | data[1]
        lux = round(raw / 1.2, 2)
        return {"light": lux}
    except Exception as e:
        print(f"⚠️ BH1750 read error: {e}")
        return {"light": None}


# -----------------------------
# Read Soil Moisture (Serial)
# -----------------------------
def read_soil_serial():
    try:
        ser = serial.Serial(SERIAL_PORT, SERIAL_BAUD, timeout=1)
        line = ser.readline().decode("utf-8").strip()
        if line:
            print(f"📥 Soil Serial: {line}")
            return {"soil_moisture": float(line)}
    except Exception as e:
        print(f"⚠️ Soil serial error: {e}")
    return {"soil_moisture": None}


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
async def sensor_loop():
    ws_url = f"{BACKEND_WS_URL}?token={WS_TOKEN}"

    while True:
        try:
            print(f"🌐 Connecting to backend WS: {ws_url}")
            async with websockets.connect(ws_url) as ws:
                print("🟢 Connected to backend.")

                while True:
                    dht = read_dht22()
                    light = read_bh1750()
                    soil = read_soil_serial()

                    payload = {
                        "sensor": "plant",
                        "timestamp": time.time(),
                        **dht,
                        **light,
                        **soil
                    }

                    await send_to_backend(ws, payload)
                    await asyncio.sleep(2)

        except Exception as e:
            print(f"❌ WebSocket error: {e}")
            print("🔄 Reconnecting in 3 seconds...")
            time.sleep(RECONNECT_DELAY)


# -----------------------------
# Entry Point
# -----------------------------
if __name__ == "__main__":
    print("🌱 Env Sensor Service Starting...")
    asyncio.run(sensor_loop())
