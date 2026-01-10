// src/services/PlantMonService.ts
import { RealtimeServer } from "../websocket/WebSocketServer";

export class PlantMonService {
  latest: any = null;

  constructor(private app: any) {
    this.startSimulation();
  }

  startSimulation() {
    // Telemetry loop (every 2 seconds)
    setInterval(() => {
      const sample = {
        type: "plant",
        payload: {
          moisture: Math.floor(Math.random() * 100),
          light: 100 + Math.floor(Math.random() * 300),
          temperature: 20 + Math.random() * 5
        }
      };

      this.latest = sample.payload;   // <-- CORRECT PATCH
      this.app.realtime.broadcast("plant", sample);
    }, 2000);

    // AI recommendation loop (every 10 seconds)
    setInterval(async () => {
      const context = this.latest || {
        moisture: 50,
        light: 200,
        temperature: 22
      };

      const rec = await this.app.ai.generateRecommendation(
        JSON.stringify(context)
      );

      this.app.realtime.broadcast("plant", {
        type: "recommendations",
        recommendations: [rec]
      });
    }, 10000);
  }
}
