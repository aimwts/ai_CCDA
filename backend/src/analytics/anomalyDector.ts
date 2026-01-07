export class AnomalyDetector {
  history: Record<string, number[]> = {};

  addReading(sensor: string, value: number) {
    if (!this.history[sensor]) this.history[sensor] = [];
    this.history[sensor].push(value);
    this.history[sensor] = this.history[sensor].slice(-200);
  }

  detect(sensor: string) {
    const values = this.history[sensor];
    if (!values || values.length < 20) return { isAnomaly: false, score: 0 };

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
    const std = Math.sqrt(variance);

    const latest = values[values.length - 1];
    const z = Math.abs((latest - mean) / (std || 1));

    return { isAnomaly: z > 3, score: z };
  }
}
