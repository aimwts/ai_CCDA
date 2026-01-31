import { AiClient } from "./AiClient";
import { ITrendService } from "../types/ITrendService";

export class AiTrendService implements ITrendService {
  private client: AiClient;

  constructor(apiKey: string) {
    this.client = AiClient.getInstance(apiKey);
  }

  async generate(prompt: string): Promise<string> {
    return this.client.generateText(prompt);
  }

  async analyzeTrends(context: string): Promise<string> {
    const prompt = `Analyze the following telemetry and describe emerging trends, anomalies, and expected future behavior:\n\n${context}`;
    return this.generate(prompt);
  }
}
