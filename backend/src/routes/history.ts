import { Router } from "express";
import { db } from "../db";

const router = Router();

router.get("/:sensor", async (req, res) => {
  const sensor = req.params.sensor;
  const hours = Number(req.query.hours || 24);

  if (!["machine", "sensehat", "system", "aggregate"].includes(sensor)) {
    res.status(400).json({ error: "Unknown sensor channel" });
    return;
  }

  if (!Number.isFinite(hours) || hours <= 0 || hours > 168) {
    res.status(400).json({ error: "hours must be a number between 1 and 168" });
    return;
  }

  try {
    const sensors = sensor === "aggregate" ? ["machine", "sensehat", "system"] : [sensor];
    const result = await db.query(
      "SELECT sensor, metric, value, timestamp FROM public.sensor_history WHERE sensor = ANY($1::text[]) AND timestamp > NOW() - ($2 * INTERVAL '1 hour') ORDER BY timestamp ASC",
      [sensors, hours]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("History query failed. Is PostgreSQL configured and running?", error);
    res.status(503).json({ error: "Historical data is unavailable. Check the PostgreSQL connection." });
  }
});

export default router;
