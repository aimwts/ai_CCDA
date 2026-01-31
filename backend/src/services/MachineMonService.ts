import { RealtimeServer } from "../websocket/WebSocketServer";
import { AiClient } from "./AiClient";

export class MachineMonService {
  latest: any = null;
  private client: AiClient;

  constructor(private app: any, apiKey: string) {
    this.client = AiClient.getInstance(apiKey);
    this.startSimulation();
  }

  startSimulation() {
    // Telemetry loop (every 2 seconds)
    setInterval(() => {
      const sample = {
        type: "machine",
        payload: {
          moisture: Math.floor(Math.random() * 100),
          light: 100 + Math.floor(Math.random() * 300),
          temperature: 20 + Math.random() * 5
        }
      };

      this.latest = sample.payload;
      this.app.realtime.broadcast("machine", sample);
    }, 2000);

    // AI recommendation loop (every 10 seconds)
    setInterval(async () => {
      const context = this.latest || {};
      const prompt = `Provide a machine‑care recommendation:\n\n${JSON.stringify(context)}`;
      const rec = await this.client.generateText(prompt);

      this.app.realtime.broadcast("machine", {
        type: "recommendations",
        recommendations: [rec]
      });
    }, 10000);
  }
}
