import { AiClient } from "./AiClient";

export class SystemMonitorService {
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
        type: "system",
        payload: {
          cpu: Math.random() * 100,
          memory: Math.random() * 100,
          disk: Math.random() * 100
        }
      };

      this.latest = sample.payload;
      this.app.realtime.broadcast("system", sample);
    }, 2000);

    // AI system insight loop (every 10 seconds)
    setInterval(async () => {
      const context = this.latest || {};
      const prompt = `Identify system risks and recommended mitigations:\n\n${JSON.stringify(context)}`;
      const rec = await this.client.generateText(prompt);

      this.app.realtime.broadcast("system", {
        type: "recommendations",
        recommendations: [rec]
      });
    }, 10000);
  }
}
