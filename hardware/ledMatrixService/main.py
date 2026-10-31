import asyncio
import json
import websockets
import os

try:
    from sense_hat import SenseHat
except ImportError:
    SenseHat = None

BACKEND_WS_URL = os.getenv("BACKEND_WS_URL", "ws://backend:4000/led")
WS_TOKEN = os.getenv("WS_TOKEN", "my-secret-token")

sense = SenseHat() if SenseHat else None
RECONNECT_DELAY = 3

async def led_loop():
    ws_url = f"{BACKEND_WS_URL}?token={WS_TOKEN}"

    while True:
        try:
            print(f"🌐 Connecting to backend WS: {ws_url}")
            async with websockets.connect(ws_url) as ws:
                print("🟢 LED Matrix connected.")

                async for message in ws:
                    try:
                        data = json.loads(message)
                        print(f"📥 LED Command: {data}")

                        if "text" in data:
                            if sense is None:
                                print("⚠️ LED Matrix unavailable in this environment.")
                            else:
                                sense.show_message(data["text"], scroll_speed=0.05)

                        if "pixel" in data:
                            if sense is None:
                                print("⚠️ LED Matrix unavailable in this environment.")
                            else:
                                x, y, r, g, b = data["pixel"]
                                sense.set_pixel(x, y, r, g, b)

                        if "clear" in data:
                            if sense is not None:
                                sense.clear()

                    except Exception as e:
                        print(f"⚠️ LED command error: {e}")

        except Exception as e:
            print(f"❌ LED WS error: {e}")
            print("🔄 Reconnecting in 3 seconds...")
            await asyncio.sleep(RECONNECT_DELAY)

if __name__ == "__main__":
    print("💡 LED Matrix Service Starting...")
    asyncio.run(led_loop())
