import asyncio
import json
import os
import time
import websockets
from sense_hat import SenseHat

BACKEND_WS_URL = os.getenv("BACKEND_WS_URL", "ws://backend:4000/sensehat")
WS_TOKEN = os.getenv("WS_TOKEN", "my-secret-token")

sense = SenseHat()
RECONNECT_DELAY = 3

def read_sensehat():
    try:
        return {
            "temperature": round(sense.get_temperature(), 2),
            "humidity": round(sense.get_humidity(), 2),
            "pressure": round(sense.get_pressure(), 2),
            "orientation": sense.get_orientation(),
            "accel": sense.get_accelerometer_raw(),
            "gyro": sense.get_gyroscope_raw(),
            "mag": sense.get_compass_raw()
        }
    except Exception as e:
        print(f"⚠️ SenseHat read error: {e}")
        return None

async def send_to_backend(ws, payload):
    try:
        await ws.send(json.dumps(payload))
        print(f"📤 Sent to backend: {payload}")
    except Exception as e:
        print(f"❌ WS send error: {e}")

async def sensehat_loop():
    ws_url = f"{BACKEND_WS_URL}?token={WS_TOKEN}"

    while True:
        try:
            print(f"🌐 Connecting to backend WS: {ws_url}")
            async with websockets.connect(ws_url) as ws:
                print("🟢 Connected to backend.")

                while True:
                    data = read_sensehat()
                    if not data:
                        await asyncio.sleep(0.5)
                        continue

                    payload = {
                        "sensor": "sensehat",
                        "timestamp": time.time(),
                        **data
                    }

                    await send_to_backend(ws, payload)
                    await asyncio.sleep(0.5)

        except Exception as e:
            print(f"❌ WebSocket error: {e}")
            print("🔄 Reconnecting in 3 seconds...")
            time.sleep(RECONNECT_DELAY)

if __name__ == "__main__":
    print("🛰️ SenseHat Service Starting...")
    asyncio.run(sensehat_loop())
