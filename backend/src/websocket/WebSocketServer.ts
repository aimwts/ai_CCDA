// src/websocket/WebSocketServer.ts
import { WebSocketServer } from "ws";
import url from "url";

export class RealtimeServer {
  private wss: WebSocketServer;
  private channels: Record<string, Set<any>> = {};

  constructor(port: number = 4000) {
    this.wss = new WebSocketServer({ port });
    console.log(`[WebSocket] ws://localhost:${port}`);

    this.wss.on("connection", (ws, req) => {
      const { query } = url.parse(req.url!, true);
      const token = query.token as string;
      const channel = (query.channel as string) || "default";

      if (!this.validateToken(token)) {
        ws.send(JSON.stringify({ type: "error", message: "Invalid token" }));
        ws.close();
        return;
      }

      if (!this.channels[channel]) this.channels[channel] = new Set();
      this.channels[channel].add(ws);

      ws.send(JSON.stringify({ type: "connected", channel }));

      ws.on("close", () => {
        this.channels[channel].delete(ws);
      });
    });
  }

  validateToken(token: string): boolean {
    return token === "my-secret-token";
  }

  broadcast(channel: string, data: any) {
    const msg = JSON.stringify(data);
    const clients = this.channels[channel] || new Set();

    clients.forEach((client) => {
      if (client.readyState === 1) client.send(msg);
    });
  }
}
