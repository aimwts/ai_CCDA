import dotenv from "dotenv";
dotenv.config();

import { AppOrchestrator } from "./AppOrchestrator";

function main() {
  const app = new AppOrchestrator();
  app.init();
}

main();

import { AiClient } from "./services/AiClient";

async function testGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

  const ai = AiClient.getInstance(apiKey);
  const response = await ai.generateText("List 3 creative uses for a paperclip.");
  console.log("Gemini response:\n", response);
}

testGemini();
