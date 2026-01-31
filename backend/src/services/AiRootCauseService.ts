import { AiClient } from "./AiClient";
import { IRootCauseService } from "../types/IRootCauseService";

export class RootCauseService implements IRootCauseService {
  private client: AiClient;

  constructor(apiKey: string) {
    this.client = AiClient.getInstance(apiKey);
  }

  async generate(prompt: string): Promise<string> {
    return this.client.generateText(prompt);
  }

  async analyzeRootCause(context: string): Promise<string> {
    const prompt = `Identify likely root causes and recommended next steps:\n\n${context}`;
    return this.generate(prompt);
  }
}
