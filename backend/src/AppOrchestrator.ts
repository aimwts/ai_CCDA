// src/AppOrchestrator.ts
import { RealtimeServer } from "./websocket/WebSocketServer";

// AI Services
import { AiClient } from "./services/AiClient";
import { AiRecommendationService } from "./services/AiRecommendationService";
import { AiTrendService } from "./services/AiTrendService";
import { SummaryService } from "./services/AiSummaryService";
import { RootCauseService } from "./services/AiRootCauseService";
import { RecommendationFeedService } from "./services/AiRecommendationFeedService";

// AI Interfaces
import {
  IAiRecommendationService,
  ITrendService,
  ISummaryService,
  IRootCauseService,
  IRecommendationFeedService
} from "./types";

// Telemetry Services
import { MachineMonService } from "./services/MachineMonService";
import { SenseHatService } from "./services/SenseHatService";
import { SystemMonitorService } from "./services/SystemMonitorService";

export class AppOrchestrator {
  realtime!: RealtimeServer;

  // Shared AI client
  ai!: AiClient;

  // Typed AI service fields
  aiRecommendation!: IAiRecommendationService;
  aiTrend!: ITrendService;
  aiSummary!: ISummaryService;
  aiRootCause!: IRootCauseService;
  aiFeed!: IRecommendationFeedService;

  // Telemetry services
  machine!: MachineMonService;
  sense!: SenseHatService;
  system!: SystemMonitorService;

  init() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY in environment");
    }

    // WebSocket server
    this.realtime = new RealtimeServer(4000);

    // Shared AI client (singleton)
    this.ai = AiClient.getInstance(apiKey);

    // AI services
    this.aiRecommendation = new AiRecommendationService(this.ai);
    // this.aiTrend = new AiTrendService(apiKey);
    // this.aiSummary = new SummaryService(apiKey);
    // this.aiRootCause = new RootCauseService(apiKey);
    // this.aiFeed = new RecommendationFeedService(apiKey);

    // Telemetry services
    this.machine = new MachineMonService(this, apiKey);
    this.sense = new SenseHatService(this, apiKey);
    this.system = new SystemMonitorService(this, apiKey);

    console.log("App orchestrator initialized");
  }
}
