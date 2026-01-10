// src/services/ZonesService.ts

export class ZonesService {
  latest: any = {};

  constructor(private app: any) {
    this.startZoneService();
  }

  startZoneService() {
    const zones = ["zone1", "zone2", "zone3"];

    // Telemetry loop (every 2 seconds)
    setInterval(() => {
      zones.forEach((zone) => {
        const sample = {
          type: "zone",
          payload: {
            zone,
            temperature: 20 + Math.random() * 5,
            humidity: 40 + Math.random() * 20,
            status: ["OK", "Warning", "Critical"][
              Math.floor(Math.random() * 3)
            ]
          }
        };

        // Store latest per-zone
        this.latest[zone] = sample.payload;

        this.app.realtime.broadcast(zone, sample);
      });
    }, 2000);

    // AI recommendation loop (every 10 seconds)
    setInterval(async () => {
      for (const zone of zones) {
        const context = this.latest[zone] || {
          zone,
          temperature: 22,
          humidity: 50,
          status: "OK"
        };

        const rec = await this.app.ai.generateRecommendation(
          JSON.stringify(context)
        );

        this.app.realtime.broadcast(zone, {
          type: "recommendations",
          recommendations: [rec]
        });
      }
    }, 10000);
  }
}
