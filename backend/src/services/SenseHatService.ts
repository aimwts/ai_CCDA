// src/services/SenseHatService.ts
import os from "os";

export class SenseHatService {
  latest: any = null;

  constructor(private app: any) {
    this.startSimulation();
  }

  startSimulation() {
    // Telemetry loop (every 2 seconds)
    setInterval(() => {
      const sample = {
        type: "sensehat",
        payload: {
          temperature: 20 + Math.random() * 5,
          humidity: 40 + Math.random() * 20,
          pressure: 980 + Math.random() * 40
        }
      };

      this.latest = sample.payload;   // <-- CORRECT PATCH
      this.app.realtime.broadcast("sensehat", sample);
    }, 2000);

    // AI recommendation loop (every 10 seconds)
    setInterval(async () => {
      const context = this.latest || {
        temperature: 22,
        humidity: 50,
        pressure: 1000
      };

      const rec = await this.app.ai.generateRecommendation(
        JSON.stringify(context)
      );

      this.app.realtime.broadcast("sensehat", {
        type: "recommendations",
        recommendations: [rec]
      });
    }, 10000);
  }
}
