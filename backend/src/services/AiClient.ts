import { GoogleGenerativeAI } from "@google/generative-ai";

export class AiClient {
  private static instance: AiClient;
  private model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]>;

  private constructor(apiKey: string) {
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });
  }

  static getInstance(apiKey: string): AiClient {
    if (!AiClient.instance) {
      AiClient.instance = new AiClient(apiKey);
    }
    return AiClient.instance;
  }

  async generateText(prompt: string): Promise<string> {
    if (!process.env.GEMINI_API_KEY) {
      return "AI insight unavailable. Configure a valid Gemini API key to enable live analysis.";
    }

    try {
      const result = await this.model.generateContent([prompt]);
      const response = await result.response;
      return response.text() ?? "AI insight unavailable.";
    } catch (error) {
      console.warn("AI generation failed; using fallback text.", error);
      return "AI insight unavailable. Configure a valid Gemini API key to enable live analysis.";
    }
  }
}
