import { AppOrchestrator } from "../AppOrchestrator";
import { db } from "../db";

export class SenseHatService {
  constructor(private main: AppOrchestrator) {}

  async handleUpdate(updateData: any) {
    const { temperature, humidity, pressure } = updateData;

    await db.query(
      "INSERT INTO sensor_history (sensor, value) VALUES ($1, $2)",
      ["temperature", temperature]
    );

    const analytics = this.main.analytics.processSensor("temperature", temperature);

    this.main.realtime.broadcast("sensehat", {
      type: "sensehat",
      payload: updateData,
      recommendations: analytics.recommendations
    });
  }
}
