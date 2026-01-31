// src/services/AiAnomalyService.ts

export class AiAnomalyService {
    lastAnomalies: any[] | null = null;
    
        history: any = {
        plant: [],
        sensehat: [],
        system: [],
        zones: {}
  };

  constructor(private app: any) {
    this.startAnomalyLoop();
  }

  startAnomalyLoop() {
    setInterval(async () => {
      const snapshot = {
        plant: this.app.plant?.latest,
        sensehat: this.app.sensehat?.latest,
        system: this.app.system?.latest,
        zones: this.app.zones?.latest
      };

      const anomalies = this.detectAnomalies(snapshot);

      // Add this line — 
      this.lastAnomalies = anomalies;

      if (anomalies.length > 0) {
        const aiExplanation = await this.app.ai.generateRecommendation(
          `Explain the following anomalies and their likely causes:\n${JSON.stringify(anomalies)}`
        );

        this.app.realtime.broadcast("ai_anomaly", {
          type: "ai_anomaly",
          anomalies,
          explanation: aiExplanation
        });
      }

      this.updateHistory(snapshot);
    }, 8000);
  }

  updateHistory(snapshot: any) {
    const push = (arr: any[], value: any) => {
      arr.push(value);
      if (arr.length > 20) arr.shift();
    };

    if (snapshot.plant) push(this.history.plant, snapshot.plant);
    if (snapshot.sensehat) push(this.history.sensehat, snapshot.sensehat);
    if (snapshot.system) push(this.history.system, snapshot.system);

    if (snapshot.zones) {
      for (const zone of Object.keys(snapshot.zones)) {
        this.history.zones[zone] = this.history.zones[zone] || [];
        push(this.history.zones[zone], snapshot.zones[zone]);
      }
    }
  }

  detectAnomalies(snapshot: any) {
    const anomalies: any[] = [];

    const check = (name: string, latest: any, history: any[]) => {
      if (!latest || history.length < 5) return;

      const avg = (key: string) =>
        history.reduce((a, b) => a + b[key], 0) / history.length;

      for (const key of Object.keys(latest)) {
        if (typeof latest[key] === "number") {
          const baseline = avg(key);
          const deviation = Math.abs(latest[key] - baseline);

          if (deviation > baseline * 0.35) {
            anomalies.push({
              source: name,
              metric: key,
              value: latest[key],
              baseline,
              deviation
            });
          }
        }
      }
    };

    check("plant", snapshot.plant, this.history.plant);
    check("sensehat", snapshot.sensehat, this.history.sensehat);
    check("system", snapshot.system, this.history.system);

    if (snapshot.zones) {
      for (const zone of Object.keys(snapshot.zones)) {
        check(zone, snapshot.zones[zone], this.history.zones[zone] || []);
      }
    }

    return anomalies;
  }
}
