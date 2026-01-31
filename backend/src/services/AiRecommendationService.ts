import { AiClient } from "./AiClient";
import { IAiRecommendationService } from "../types";

export class AiRecommendationService implements IAiRecommendationService {
  constructor(private ai: AiClient) {}

  async generateRecommendation(input: string): Promise<string[]> {
    const prompt = `
You are an expert recommendation engine. Based on the following input, generate a concise list of 3–5 actionable recommendations. 
Each recommendation should be a single sentence, starting with a verb. Format as a plain list.

Input:
${input}
`;

    const raw = await this.ai.generateText(prompt);

    // Split into lines and filter out empty or non-bullet lines
    return raw
      .split("\n")
      .map(line => line.trim().replace(/^[-*]\s*/, ""))
      .filter(line => line.length > 0);
  }
}
