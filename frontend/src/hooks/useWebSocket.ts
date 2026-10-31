import { useEffect, useState } from "react";

export function useWebSocket(
  channel: string,
  token = import.meta.env.VITE_WS_TOKEN || "my-secret-token"
) {
  const [message, setMessage] = useState<any>(null);

  useEffect(() => {
    const wsBase = (import.meta.env.VITE_WS_URL || "ws://localhost:4000").replace(/\/+$/, "");
    const query = new URLSearchParams({ token, channel });
    const ws = new WebSocket(`${wsBase}?${query.toString()}`);

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
