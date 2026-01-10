import { AnomalyDetector } from "./anomalyDetector";
import { Predictor } from "./predictor";
import { RecommendationEngine } from "./recommendationEngine";
import { LLMExplain } from "./llmExplain";

export class AnalyticsOrchestrator {
  private anomaly = new AnomalyDetector();
  private predictor = new Predictor();
  private recs = new RecommendationEngine();
  private llm = new LLMExplain();

  processSensor(sensor: string, value: number) {
    this.anomaly.addReading(sensor, value);

    const anomaly = this.anomaly.detect(sensor);
    const prediction = this.predictor.predictNext(this.anomaly.history[sensor] || []);
    const recommendations = this.recs.generate(sensor, value, prediction, anomaly.score);

    return { anomaly, prediction, recommendations };
  }

  async explain(sensor: string, history: number[]) {
    return this.llm.explainSensorTrend(sensor, history);
  }
}
