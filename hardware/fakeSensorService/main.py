import asyncio
import json
import time
import websockets

async def fake_loop():
    url = "ws://localhost:4000/plant?token=my-secret-token"
    print("Connecting to", url)

    while True:
        try:
            async with websockets.connect(url) as ws:
                print("Connected.")

                while True:
                    payload = {
                        "sensor": "plant",
                        "timestamp": time.time(),
                        "temperature": 22 + (time.time() % 5),
                        "humidity": 50 + (time.time() % 10),
                        "light": 300 + (time.time() % 50),
                        "soil_moisture": 400 + (time.time() % 20)
                    }

                    await ws.send(json.dumps(payload))
                    print("Sent:", payload)
                    await asyncio.sleep(1)

        except Exception as e:
            print("Error:", e)
            await asyncio.sleep(2)

asyncio.run(fake_loop())
