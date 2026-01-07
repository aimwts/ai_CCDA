import asyncio
import json
import os
import time
import websockets
from mpu6050 import mpu6050

BACKEND_WS_URL = os.getenv("BACKEND_WS_URL", "ws://backend:4000/imu")
WS_TOKEN = os.getenv("WS_TOKEN", "my-secret-token")

IMU_ADDR = int(os.getenv("IMU_ADDR", "0x68"), 16)
RECONNECT_DELAY = 3

sensor = mpu6050(IMU_ADDR)

def read_imu():
    try:
        accel = sensor.get_accel_data()
        gyro = sensor.get_gyro_data()
        temp = sensor.get_temp()

        return {
            "accel_x": accel["x"],
            "accel_y": accel["y"],
            "accel_z": accel["z"],
            "gyro_x": gyro["x"],
            "gyro_y": gyro["y"],
            "gyro_z": gyro["z"],
            "temperature": temp
        }
    except Exception as e:
        print(f"⚠️ IMU read error: {e}")
        return None

async def send_to_backend(ws, payload):
    try:
        await ws.send(json.dumps(payload))
        print(f"📤 Sent to backend: {payload}")
    except Exception as e:
        print(f"❌ WS send error: {e}")

async def imu_loop():
    ws_url = f"{BACKEND_WS_URL}?token={WS_TOKEN}"

    while True:
        try:
            print(f"🌐 Connecting to backend WS: {ws_url}")
            async with websockets.connect(ws_url) as ws:
                print("🟢 Connected to backend.")

                while True:
                    data = read_imu()
                    if not data:
                        await asyncio.sleep(0.1)
                        continue

                    payload = {
                        "sensor": "imu",
                        "timestamp": time.time(),
                        **data
                    }

                    await send_to_backend(ws, payload)
                    await asyncio.sleep(0.1)

        except Exception as e:
            print(f"❌ WebSocket error: {e}")
            print("🔄 Reconnecting in 3 seconds...")
            time.sleep(RECONNECT_DELAY)

if __name__ == "__main__":
    print("🧭 IMU Service Starting...")
    asyncio.run(imu_loop())
