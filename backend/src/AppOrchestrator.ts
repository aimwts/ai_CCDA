// src/AppOrchestrator.ts
import { RealtimeServer } from "./websocket/WebSocketServer";
import { PlantMonService } from "./services/PlantMonService";
import { SenseHatService } from "./services/SenseHatService";
import { SystemMonitorService } from "./services/SystemMonitorService";
import { AiRecommendationService } from "./services/AiRecommendationService";
import { AiSummaryService } from "./services/AiSummaryService";
import { AiAnomalyService } from "./services/AiAnomalyService";

export class AppOrchestrator {
  realtime!: RealtimeServer;
  plant!: PlantMonService;
  sensehat!: SenseHatService;
  system!: SystemMonitorService;
  ai!: AiRecommendationService;
  aiSummary!: AiSummaryService;
  anomaly!: AiAnomalyService;

  init() {
    this.realtime = new RealtimeServer(4000);
    this.plant = new PlantMonService(this);
    this.sensehat = new SenseHatService(this);
    this.system = new SystemMonitorService(this);
    this.ai = new AiRecommendationService(process.env.GEMINI_API_KEY!);
    this.aiSummary = new AiSummaryService(this);
    this.anomaly = new AiAnomalyService(this);

    console.log("App orchestrator initialized");
  }
}
