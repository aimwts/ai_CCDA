import { AiClient } from "./AiClient";
import { ISummaryService } from "../types/ISummaryService";

export class SummaryService implements ISummaryService {
  private client: AiClient;

  constructor(apiKey: string) {
    this.client = AiClient.getInstance(apiKey);
  }

  async generate(prompt: string): Promise<string> {
    return this.client.generateText(prompt);
  }

  async summarize(context: string): Promise<string> {
    const prompt = `Summarize the following data in clear, concise language:\n\n${context}`;
    return this.generate(prompt);
  }
}
