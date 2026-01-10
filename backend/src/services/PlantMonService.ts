import { AppOrchestrator } from "../AppOrchestrator";
import { db } from "../db";

export class PlantMonService {
  constructor(private main: AppOrchestrator) {}

  async handleUpdate(updateData: any) {
    const { moisture, light, temperature } = updateData;

    await db.query(
      "INSERT INTO sensor_history (sensor, value) VALUES ($1, $2)",
      ["moisture", moisture]
    );

    const analytics = this.main.analytics.processSensor("moisture", moisture);

    this.main.realtime.broadcast("plant", {
      type: "plant",
      payload: updateData,
      recommendations: analytics.recommendations
    });
  }
}
