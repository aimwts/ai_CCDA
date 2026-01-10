// src/services/SystemMonitorService.ts
import os from "os";

export class SystemMonitorService {
  latest: any = null;

  constructor(private app: any) {
    this.startMonitoring();   // <-- FIXED
  }

  startMonitoring() {
    // Telemetry loop (every 2 seconds)
    setInterval(() => {
      const sample = {
        type: "system",
        payload: {
          cpu: this.getCpuUsage(),
          memory: this.getMemoryUsage(),
          uptime: os.uptime(),
          load: os.loadavg()
        }
      };

      this.latest = sample.payload;   // <-- CORRECT PATCH
      this.app.realtime.broadcast("system", sample);
    }, 2000);

    // AI recommendation loop (every 10 seconds)
    setInterval(async () => {
      const context = this.latest || {
        cpu: 0,
        memory: 0,
        uptime: 0,
        load: [0, 0, 0]
      };

      const rec = await this.app.ai.generateRecommendation(
        JSON.stringify(context)
      );

      this.app.realtime.broadcast("system", {
        type: "recommendations",
        recommendations: [rec]
      });
    }, 10000);
  }

  getMemoryUsage() {
    const total = os.totalmem();
    const free = os.freemem();
    return Number((((total - free) / total) * 100).toFixed(2));
  }

  getCpuUsage() {
    const cpus = os.cpus();
    let idle = 0;
    let total = 0;

    cpus.forEach((core) => {
      for (const type in core.times) {
        total += core.times[type as keyof typeof core.times];
      }
      idle += core.times.idle;
    });

    return Number(((1 - idle / total) * 100).toFixed(2));
  }
}
