import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import { AppOrchestrator } from "./AppOrchestrator";
import { AiClient } from "./services/AiClient";
import analyticsRouter from "./routes/analytics";
import historyRouter from "./routes/history";

function main() {
  const app = new AppOrchestrator();
  app.init();

  const api = express();
  api.use(cors());
  api.use(express.json());

  api.get("/health", (_, res) => {
    res.json({ status: "ok", service: "ai-ccda-backend" });
  });

  api.get("/", (_, res) => {
    res.json({ status: "ok", service: "ai-ccda-backend" });
  });

  api.get("/sensors/machine", (_, res) => {
    res.json({ sensor: "machine", data: [] });
  });

  api.get("/sensors/sensehat", (_, res) => {
    res.json({ sensor: "sensehat", data: [] });
  });

  api.get("/aggregate/sensors", (_, res) => {
    res.json({ sensors: ["machine", "sensehat", "system"] });
  });

  api.get("/aggregate/status", (_, res) => {
    res.json({ healthy: true, uptime: 0 });
  });

  api.get("/system/status", (_, res) => {
    res.json({ healthy: true, uptime: 0 });
  });

  api.get("/zones", (_, res) => {
    res.json([]);
  });

  api.get("/zones/:id", (req, res) => {
    res.json({ id: req.params.id, name: "Zone " + req.params.id, healthy: true });
  });

  api.use("/analytics", analyticsRouter);
  api.use("/history", historyRouter);

  const port = Number(process.env.API_PORT || 3000);
  api.listen(port, () => {
    console.log(`API server listening on http://localhost:${port}`);
  });
}

main();

async function testGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log("Gemini startup check skipped: no real API key configured.");
    return;
  }

  try {
    const ai = AiClient.getInstance(apiKey);
    const response = await ai.generateText("List 3 creative uses for a paperclip.");
    console.log("Gemini response:\n", response);
  } catch (error) {
    console.warn("Gemini startup check failed; continuing without live AI responses.", error);
  }
}

testGemini();
