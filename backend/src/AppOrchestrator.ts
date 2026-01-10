import { RealtimeServer } from "./websocket/WebSocketServer";
import { PlantMonService } from "./services/PlantMonService";
import { SenseHatService } from "./services/SenseHatService";
import { AnalyticsOrchestrator } from "./analytics/analyticsOrchestrator";

export class AppOrchestrator {
  realtime!: RealtimeServer;
  analytics!: AnalyticsOrchestrator;

  plant!: PlantMonService;
  sense!: SenseHatService;

  init() {
    this.realtime = new RealtimeServer(4000);
    this.analytics = new AnalyticsOrchestrator();

    this.plant = new PlantMonService(this);
    this.sense = new SenseHatService(this);

    console.log("App orchestrator initialized");
  }
}
