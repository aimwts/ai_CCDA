import { useEffect, useState } from "react";

export function useWebSocket(channel: string, token = "my-secret-token") {
  const [message, setMessage] = useState<any>(null);

  useEffect(() => {
    const ws = new WebSocket(
      `ws://localhost:4000?token=${token}&channel=${channel}`
    );

    ws.onmessage = (event) => {
      try {
        setMessage(JSON.parse(event.data));
      } catch (err) {
        console.error("WebSocket parse error:", err);
      }
    };

    return () => ws.close();
  }, [channel, token]);

  return message;
}
