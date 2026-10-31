import asyncio
import json
import os
import time
import websockets

try:
    from sense_hat import SenseHat
except ImportError:
    SenseHat = None

BACKEND_WS_URL = os.getenv("BACKEND_WS_URL", "ws://backend:4000/sensehat")
WS_TOKEN = os.getenv("WS_TOKEN", "my-secret-token")

sense = SenseHat() if SenseHat else None
RECONNECT_DELAY = 3

def read_sensehat():
    if sense is None:
        t = time.time()
        return {
            "temperature": round(22 + (t % 8), 2),
            "humidity": round(45 + ((t * 1.5) % 18), 2),
            "pressure": round(1010 + ((t * 2) % 20), 2),
            "orientation": {"roll": 0.0, "pitch": 0.0, "yaw": 0.0},
            "accel": {"x": 0.0, "y": 0.0, "z": 1.0},
            "gyro": {"x": 0.0, "y": 0.0, "z": 0.0},
            "mag": {"x": 0.0, "y": 0.0, "z": 0.0}
        }

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
