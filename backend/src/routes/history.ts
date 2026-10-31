import { Router } from "express";
import { db } from "../db";

const router = Router();

router.get("/:sensor", async (req, res) => {
  const sensor = req.params.sensor;
  const hours = Number(req.query.hours || 24);

  if (!Number.isFinite(hours) || hours <= 0 || hours > 168) {
    res.status(400).json({ error: "hours must be a number between 1 and 168" });
    return;
  }

  try {
    const result = await db.query(
      "SELECT sensor, value, timestamp FROM sensor_history WHERE sensor = $1 AND timestamp > NOW() - ($2 || ' hours')::interval ORDER BY timestamp ASC",
      [sensor, hours]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("History query failed. Is PostgreSQL configured and running?", error);
    res.status(503).json({ error: "Historical data is unavailable. Check the PostgreSQL connection." });
  }
});

export default router;
