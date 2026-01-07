export class RecommendationEngine {
  generate(sensor: string, value: number, prediction: number, anomalyScore: number) {
    const recs: string[] = [];

    if (sensor === "moisture") {
      if (value < 30) recs.push("Moisture is low — consider watering soon.");
      if (prediction < 25) recs.push("Moisture is trending downward.");
      if (anomalyScore > 3) recs.push("Unusual moisture drop detected.");
    }

    if (sensor === "temperature") {
      if (value > 30) recs.push("Temperature is high — consider cooling.");
      if (value < 15) recs.push("Temperature is low — consider warming.");
    }

    return recs;
  }
}
