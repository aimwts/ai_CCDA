import { Router } from "express";
import { db } from "../db";
import { AnalyticsOrchestrator } from "../analytics/analyticsOrchestrator";

const router = Router();
const analytics = new AnalyticsOrchestrator();

router.post("/explain", async (req, res) => {
  const { sensor, hours } = req.body;

  const result = await db.query(
    "SELECT value FROM sensor_history WHERE sensor = $1 AND timestamp > NOW() - INTERVAL $2 HOUR",
    [sensor, hours]
  );

  const explanation = await analytics.explain(sensor, result.rows.map(r => r.value));

  res.json({ explanation });
});

export default router;
