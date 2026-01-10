import { GoogleGenerativeAI } from "@google/generative-ai";

export class AiRecommendationService {
  private model;

  constructor(apiKey: string) {
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async generateRecommendation(context: string) {
    try {
      const result = await this.model.generateContent(
        `Give one short actionable recommendation based on this data:\n${context}`
      );

      return result.response.text();
    } catch (err) {
      console.error("AI error:", err);
      return "No recommendation available.";
    }
  }
}
