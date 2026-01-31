import { AiClient } from "./AiClient";
import { IRecommendationFeedService } from "../types/IRecommendationFeedService";

export class RecommendationFeedService implements IRecommendationFeedService {
  private client: AiClient;

  constructor(apiKey: string) {
    this.client = AiClient.getInstance(apiKey);
  }

  async generate(prompt: string): Promise<string> {
    return this.client.generateText(prompt);
  }

  async generateFeedItem(context: string): Promise<string> {
    const prompt = `Generate a single, high‑value recommendation:\n\n${context}`;
    return this.generate(prompt);
  }
}
