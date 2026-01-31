import { AiClient } from "./AiClient";

export class SenseHatService {
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
        type: "sensehat",
        payload: {
          humidity: 30 + Math.random() * 40,
          pressure: 900 + Math.random() * 50,
          temperature: 18 + Math.random() * 6
        }
      };

      this.latest = sample.payload;
      this.app.realtime.broadcast("sensehat", sample);
    }, 2000);

    // AI insight loop (every 10 seconds)
    setInterval(async () => {
      const context = this.latest || {};
      const prompt = `Provide an insight based on this SenseHat telemetry:\n\n${JSON.stringify(context)}`;
      const rec = await this.client.generateText(prompt);

      this.app.realtime.broadcast("sensehat", {
        type: "recommendations",
        recommendations: [rec]
      });
    }, 10000);
  }
}
